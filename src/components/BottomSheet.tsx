import { useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { Location } from '../types';

interface BottomSheetProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminMode: boolean;
  onCalibrateGPS?: () => void;
}

export function BottomSheet({ location, isOpen, onClose, isAdminMode, onCalibrateGPS }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !location) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'food':
      case 'cafe':
        return 'bg-orange-100 text-orange-700';
      case 'event':
        return 'bg-purple-100 text-purple-700';
      case 'shop':
        return 'bg-pink-100 text-pink-700';
      case 'booth':
        return 'bg-blue-100 text-blue-700';
      case 'workshop':
        return 'bg-green-100 text-green-700';
      case 'info':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeEmoji = (type: string): string => {
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

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto animate-slide-up pb-10">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 border-b border-gray-200/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{getTypeEmoji(location.type)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(location.type)}`}>
                  {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{location.label}</h2>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {location.type.charAt(0).toUpperCase() + location.type.slice(1)} Zone
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">What's Here</h3>
            <p className="text-gray-700 leading-relaxed">{location.details}</p>
          </div>

          {/* Admin Calibration Button */}
          {isAdminMode && onCalibrateGPS && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onCalibrateGPS}
                className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all shadow-lg active:scale-95"
              >
                🔧 Calibrate GPS for this Location
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
