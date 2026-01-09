import { useState, useEffect, useCallback } from 'react';
import { GPSCoordinate, CalibratedPin, Location } from '../types';

// Fallback Dev mode bounds if no calibration
const MAP_CENTER = {
  latitude: 12.99,
  longitude: 77.59,
};

const MAP_BOUNDS = {
  latDelta: 0.01,
  lonDelta: 0.01,
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<GPSCoordinate | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsAvailable(true);
      },
      () => {
        setIsAvailable(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Solve for affine transform coefficients: x = a*lat + b*lon + c
  const solveAffine = (
    p1: { gps: number; val: number },
    p2: { gps: number; val: number },
    p3: { gps: number; val: number }
  ) => {
    // We want to solve for a, b, c in: val = a*lat + b*lon + c
    // simple Cramer's rule or substitution for system of 3 linear equations
    const D =
      p1.gps * (p2.val - p3.val) +
      p2.gps * (p3.val - p1.val) +
      p3.gps * (p1.val - p2.val); // Determinant is actually of the matrix [lat, lon, 1] relative rows
      
    // Actually simpler approach: Matrix inversion is better.
    // [ lat1 lon1 1 ] [ a ]   [ x1 ]
    // [ lat2 lon2 1 ] [ b ] = [ x2 ]
    // [ lat3 lon3 1 ] [ c ]   [ x3 ]
    // return null if determinant is close to 0 (collinear points)
     return null;
  };
  
  // Helper to calculate affine coefficients from 3 points
  const getAffineCoefficients = (
    points: { lat: number; lon: number; x: number; y: number }[]
  ) => {
    if (points.length < 3) return null;

    // Use first 3 points for simplicity
    const p0 = points[0];
    const p1 = points[1];
    const p2 = points[2];

    const D = 
      p0.lat * (p1.lon - p2.lon) + 
      p1.lat * (p2.lon - p0.lon) + 
      p2.lat * (p0.lon - p1.lon);

    if (Math.abs(D) < 1e-10) return null; // Collinear

    // Solve for X coefficients (a, b, c) -> x = a*lat + b*lon + c
    // Using Cramer's rule logic simplified
    const A_x = 
      (p0.x * (p1.lon - p2.lon) + 
       p1.x * (p2.lon - p0.lon) + 
       p2.x * (p0.lon - p1.lon)) / D;
       
    const B_x = 
      (p0.x * (p2.lat - p1.lat) + 
       p1.x * (p0.lat - p2.lat) + 
       p2.x * (p1.lat - p0.lat)) / D;
       
    const C_x = 
      (p0.x * (p1.lat * p2.lon - p2.lat * p1.lon) + 
       p1.x * (p2.lat * p0.lon - p0.lat * p2.lon) + 
       p2.x * (p0.lat * p1.lon - p1.lat * p0.lon)) / D;

    // Solve for Y coefficients (d, e, f) -> y = d*lat + e*lon + f
    const A_y = 
      (p0.y * (p1.lon - p2.lon) + 
       p1.y * (p2.lon - p0.lon) + 
       p2.y * (p0.lon - p1.lon)) / D;
       
    const B_y = 
      (p0.y * (p2.lat - p1.lat) + 
       p1.y * (p0.lat - p2.lat) + 
       p2.y * (p1.lat - p0.lat)) / D;
       
    const C_y = 
      (p0.y * (p1.lat * p2.lon - p2.lat * p1.lon) + 
       p1.y * (p2.lat * p0.lon - p0.lat * p2.lon) + 
       p2.y * (p0.lat * p1.lon - p1.lat * p0.lon)) / D;

    return {
      xCoeff: [A_x, B_x, C_x],
      yCoeff: [A_y, B_y, C_y]
    };
  };

  const gpsToMapPosition = useCallback((
    gps: GPSCoordinate,
    calibratedPins?: CalibratedPin[],
    allLocations?: Location[]
  ): { x: number; y: number } | null => {
    if (!gps) return null;

    // 1. Try Calibration (Affine Transform) if > 2 points
    if (calibratedPins && allLocations && calibratedPins.length >= 3) {
      // Map calibrated pins to full objects with lat/lon and x/y
      const points = calibratedPins
        .map(cp => {
          const loc = allLocations.find(l => l.id === cp.pinId);
          if (!loc) return null;
          return {
            lat: cp.gps.latitude,
            lon: cp.gps.longitude,
            x: loc.x,
            y: loc.y
          };
        })
        .filter((p): p is { lat: number; lon: number; x: number; y: number } => p !== null);

      if (points.length >= 3) {
        const coeffs = getAffineCoefficients(points);
        if (coeffs) {
          const { xCoeff, yCoeff } = coeffs;
          const x = xCoeff[0] * gps.latitude + xCoeff[1] * gps.longitude + xCoeff[2];
          const y = yCoeff[0] * gps.latitude + yCoeff[1] * gps.longitude + yCoeff[2];
          
          return {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
          };
        }
      }
    }
    
    // 2. Fallback: Simple Offset if 1 point (Not implemented fully, just shifts center)
    // For now, fallback to default if not fully calibrated
    
    // Normalize coordinates to 0-100 range based on map bounds
    const x = ((gps.longitude - (MAP_CENTER.longitude - MAP_BOUNDS.lonDelta / 2)) / MAP_BOUNDS.lonDelta) * 100;
    const y = ((gps.latitude - (MAP_CENTER.latitude - MAP_BOUNDS.latDelta / 2)) / MAP_BOUNDS.latDelta) * 100;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, 100 - y)),
    };
  }, []);

  const requestLocation = (): Promise<GPSCoordinate | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          setIsAvailable(true);
          resolve(coords);
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  return {
    location,
    isAvailable,
    gpsToMapPosition,
    requestLocation,
  };
};
