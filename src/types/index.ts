export interface Location {
  id: string;
  x: number; // Percentage position on map (0-100)
  y: number; // Percentage position on map (0-100)
  label: string;
  type: 'food' | 'cafe' | 'booth' | 'event' | 'workshop' | 'shop' | 'info';
  details: string;
}

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
}

export interface CalibratedPin {
  pinId: string;
  gps: GPSCoordinate;
}

export type CategoryType = 'food' | 'cafe' | 'event' | 'shop' | 'booth' | 'workshop' | 'info' | 'all';
