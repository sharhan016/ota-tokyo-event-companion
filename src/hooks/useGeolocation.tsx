import { useState, useEffect } from 'react';
import { GPSCoordinate } from '../types';

// Dev mode bounds - map covers approximately this area
const MAP_CENTER = {
  latitude: 12.99,
  longitude: 77.59,
};

const MAP_BOUNDS = {
  latDelta: 0.01, // ~1km
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
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Convert GPS coordinates to map X/Y percentage
  const gpsToMapPosition = (gps: GPSCoordinate): { x: number; y: number } | null => {
    if (!gps) return null;

    // Normalize coordinates to 0-100 range based on map bounds
    const x = ((gps.longitude - (MAP_CENTER.longitude - MAP_BOUNDS.lonDelta / 2)) / MAP_BOUNDS.lonDelta) * 100;
    const y = ((gps.latitude - (MAP_CENTER.latitude - MAP_BOUNDS.latDelta / 2)) / MAP_BOUNDS.latDelta) * 100;

    // Clamp to map boundaries
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, 100 - y)), // Invert Y axis
    };
  };

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
