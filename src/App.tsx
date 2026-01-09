import { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { CategoryChips } from './components/CategoryChips';
import { SearchFAB } from './components/SearchFAB';
import { BottomSheet } from './components/BottomSheet';
import { LocateMeButton } from './components/LocateMeButton';
import { locations } from './data/venues';
import { useAdminMode } from './hooks/useAdminMode';
import { useGeolocation } from './hooks/useGeolocation';
import { useGPS } from './hooks/useGPS';
import { Location, CategoryType } from './types';
import { Shield } from 'lucide-react';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [centerOn, setCenterOn] = useState<{ x: number; y: number; timestamp: number } | null>(null);

  const { isAdminMode, setIsAdminMode, registerClick } = useAdminMode();
  const { location: gpsLocation, isAvailable: gpsAvailable, gpsToMapPosition, requestLocation } = useGeolocation();
  const { calibratePin, getCurrentGPS, calibratedPins } = useGPS();

  // Convert GPS to map position
  const userPosition = gpsLocation ? gpsToMapPosition(gpsLocation, calibratedPins, locations) : null;

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsBottomSheetOpen(true);
  };

  const handleSearchSelect = (location: Location) => {
    setSelectedLocation(location);
    setCenterOn({ x: location.x, y: location.y, timestamp: Date.now() });
    setIsBottomSheetOpen(true);
  };

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);

    // Admin Mode Trigger: 5 clicks on "Sponsors" (booth)
    if (category === 'booth') {
      registerClick();
    }

    // Auto-zoom to category zone
    if (category !== 'all') {
      const categoryLocation = locations.find((loc) => loc.type === category);
      if (categoryLocation) {
        setCenterOn({ x: categoryLocation.x, y: categoryLocation.y, timestamp: Date.now() });
      }
    }
  };

  const handleLocateMe = async () => {
    const coords = await requestLocation();
    if (coords) {
      const mapPos = gpsToMapPosition(coords);
      if (mapPos) {
        setCenterOn({ x: mapPos.x, y: mapPos.y, timestamp: Date.now() });
      }
    } else {
      alert('Could not get your location. Please enable location services.');
    }
  };

  const handleCalibrateGPS = async () => {
    if (!selectedLocation) return;

    const gps = await getCurrentGPS();
    if (gps) {
      calibratePin(selectedLocation.id, gps);
      alert(
        `GPS calibrated for ${selectedLocation.label}\nLat: ${gps.latitude.toFixed(6)}\nLon: ${gps.longitude.toFixed(6)}`
      );
    } else {
      alert('Failed to get GPS coordinates. Please enable location services.');
    }
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setTimeout(() => setSelectedLocation(null), 300);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Admin Mode Badge */}
      {isAdminMode && (
        <div className="fixed top-4 left-4 z-40 flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-600/90 backdrop-blur-md rounded-full shadow-lg">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Admin Mode</span>
          </div>
          <button
            onClick={() => setIsAdminMode(false)}
            className="px-4 py-2 text-sm bg-white/90 backdrop-blur-md text-red-600 font-medium rounded-full hover:bg-white transition-all shadow-lg active:scale-95"
          >
            Exit
          </button>
        </div>
      )}

      {/* Category Chips - Glassmorphic */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm">
        <div className="pt-12">
          <CategoryChips selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
        </div>
      </div>

      {/* Search FAB */}
      <SearchFAB locations={locations} onSelectLocation={handleSearchSelect} />

      {/* Map */}
      <MapComponent
        locations={locations}
        onLocationClick={handleLocationClick}
        selectedLocation={selectedLocation}
        selectedCategory={selectedCategory}
        userPosition={userPosition}
        centerOn={centerOn}
      />

      {/* Locate Me Button */}
      <LocateMeButton onClick={handleLocateMe} isActive={!!userPosition} />

      {/* Bottom Sheet */}
      <BottomSheet
        location={selectedLocation}
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        isAdminMode={isAdminMode}
        onCalibrateGPS={handleCalibrateGPS}
      />
    </div>
  );
}