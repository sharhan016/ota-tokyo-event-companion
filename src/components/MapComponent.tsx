import { useRef, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Location, CategoryType } from '../types';
import venueMapImage from 'figma:asset/4b0e465d87ad50af2ae07c1c9b6ce89b7a56c3e3.png';

interface MapComponentProps {
  locations: Location[];
  onLocationClick: (location: Location) => void;
  selectedLocation: Location | null;
  selectedCategory: CategoryType;
  userPosition: { x: number; y: number } | null;
  centerOn?: { x: number; y: number; timestamp: number } | null;
}

export function MapComponent({
  locations,
  onLocationClick,
  selectedLocation,
  selectedCategory,
  userPosition,
  centerOn,
}: MapComponentProps) {
  const transformRef = useRef<any>(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [renderSize, setRenderSize] = useState({ width: 0, height: 0 });
  const [minScale, setMinScale] = useState(1);

  // Calculate the size the image should be rendered at to fill viewport
  useEffect(() => {
    const img = new Image();
    img.src = venueMapImage;

    img.onload = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const viewAspect = vw / vh;

      let renderWidth, renderHeight;

      // Image should cover the viewport
      if (imgAspect > viewAspect) {
        // Image is wider than viewport - fit by height
        renderHeight = vh;
        renderWidth = vh * imgAspect;
      } else {
        // Image is taller than viewport - fit by width
        renderWidth = vw;
        renderHeight = vw / imgAspect;
      }

      setRenderSize({ width: renderWidth, height: renderHeight });
      setMinScale(1);

      // Center on Main Stage after a brief delay
      setTimeout(() => {
        if (transformRef.current) {
          const mainStage = locations.find((loc) => loc.id === 'stage');
          if (mainStage) {
            const targetX = vw / 2 - (mainStage.x / 100) * renderWidth;
            const targetY = vh / 2 - (mainStage.y / 100) * renderHeight;
            transformRef.current.setTransform(targetX, targetY, 1, 0);
          }
        }
      }, 100);
    };
  }, [locations]);

  // Auto center when requested
  useEffect(() => {
    if (centerOn && transformRef.current && renderSize.width > 0) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { x, y } = centerOn;
      const zoomScale = 2;

      const targetX = vw / 2 - (x / 100) * renderSize.width * zoomScale;
      const targetY = vh / 2 - (y / 100) * renderSize.height * zoomScale;

      transformRef.current.setTransform(targetX, targetY, zoomScale, 300);
    }
  }, [centerOn, renderSize]);

  const getLocationColor = (location: Location): string => {
    if (selectedLocation?.id === location.id) return '#2563eb';

    switch (location.type) {
      case 'food':
      case 'cafe':
        return '#f97316';
      case 'event':
        return '#a855f7';
      case 'shop':
        return '#ec4899';
      case 'booth':
        return '#3b82f6';
      case 'workshop':
        return '#10b981';
      case 'info':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const isLocationVisible = (location: Location): boolean => {
    if (selectedCategory === 'all') return true;
    return location.type === selectedCategory;
  };

  const getLocationEmoji = (type: string): string => {
    switch (type) {
      case 'food':
        return '🍜';
      case 'cafe':
        return '☕';
      case 'event':
        return '🎤';
      case 'shop':
        return '🛍️';
      case 'booth':
        return '🏢';
      case 'workshop':
        return '🎨';
      case 'info':
        return 'ℹ️';
      default:
        return '📍';
    }
  };

  const showLabels = currentScale > 1.5;

  if (renderSize.width === 0) {
    return <div className="w-screen h-screen bg-gray-900" />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gray-900">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={minScale}
        maxScale={4}
        limitToBounds={true}
        centerOnInit={false}
        doubleClick={{ disabled: false }}
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: true }}
        onTransformed={(ref) => {
          setCurrentScale(ref.state.scale);
        }}
      >
        <TransformComponent wrapperClass="!w-screen !h-screen">
          <div
            className="relative"
            style={{
              width: `${renderSize.width}px`,
              height: `${renderSize.height}px`,
            }}
          >
            <img
              src={venueMapImage}
              alt="Venue Map"
              className="block w-full h-full select-none"
              draggable={false}
            />

            {/* Pins Overlay */}
            <div className="absolute inset-0">
              {locations.map((location, index) => {
                const color = getLocationColor(location);
                const isVisible = isLocationVisible(location);
                const isActive = selectedLocation?.id === location.id;

                if (!isVisible && selectedCategory !== 'all') return null;

                return (
                  <button
                    key={location.id}
                    onClick={() => onLocationClick(location)}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2 
                      transition-all duration-300 hover:scale-110 active:scale-95
                      ${isVisible ? 'animate-bounce-in' : 'opacity-30 scale-75'}
                    `}
                    style={{
                      left: `${location.x}%`,
                      top: `${location.y}%`,
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="relative flex flex-col items-center">
                      {isActive && (
                        <div
                          className="absolute w-16 h-16 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: color }}
                        />
                      )}

                      <div
                        className="relative z-10 w-14 h-14 rounded-full shadow-2xl border-4 border-white flex items-center justify-center transform transition-transform"
                        style={{ backgroundColor: color }}
                      >
                        <span className="text-2xl">{getLocationEmoji(location.type)}</span>
                      </div>

                      {showLabels && (
                        <div className="mt-2 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-white/50 whitespace-nowrap">
                          <div className="text-sm font-bold" style={{ color }}>
                            {location.label}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {userPosition && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
                  style={{
                    left: `${userPosition.x}%`,
                    top: `${userPosition.y}%`,
                  }}
                >
                  <div className="relative">
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-xl" />
                    <div className="absolute inset-0 w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
