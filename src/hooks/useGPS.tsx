import { useState, useEffect } from 'react';
import { GPSCoordinate, CalibratedPin, Pin } from '../types';

const STORAGE_KEY = 'venue_gps_calibrations';
const PROXIMITY_THRESHOLD = 15; // meters

export const useGPS = () => {
  const [currentLocation, setCurrentLocation] = useState<GPSCoordinate | null>(null);
  const [calibratedPins, setCalibratedPins] = useState<CalibratedPin[]>([]);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Load calibrated pins from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCalibratedPins(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse calibrated pins:', e);
      }
    }
  }, []);

  // Start watching GPS only if browser supports it
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation not supported');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGpsEnabled(true);
        setGpsError(null);
      },
      (error) => {
        // Silently handle GPS errors - GPS is optional for the app
        setGpsEnabled(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Location permission denied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError('Location unavailable');
        } else if (error.code === error.TIMEOUT) {
          setGpsError('Location timeout');
        }
      },
      {
        enableHighAccuracy: false, // Less aggressive to avoid errors
        maximumAge: 30000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, []);

  const calibratePin = (pinId: string, gps: GPSCoordinate) => {
    const newCalibrations = calibratedPins.filter(c => c.pinId !== pinId);
    newCalibrations.push({ pinId, gps });
    
    setCalibratedPins(newCalibrations);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalibrations));
  };

  const getCurrentGPS = async (): Promise<GPSCoordinate | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Could not get GPS:', error.message);
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

  const getDistance = (coord1: GPSCoordinate, coord2: GPSCoordinate): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const findNearbyPin = (pins: Pin[]): Pin | null => {
    if (!currentLocation || !gpsEnabled) return null;

    for (const pin of pins) {
      const calibration = calibratedPins.find(c => c.pinId === pin.id);
      if (calibration) {
        const distance = getDistance(currentLocation, calibration.gps);
        if (distance <= PROXIMITY_THRESHOLD) {
          return pin;
        }
      }
    }
    return null;
  };

  return {
    currentLocation,
    calibratedPins,
    gpsEnabled,
    gpsError,
    calibratePin,
    getCurrentGPS,
    findNearbyPin,
  };
};