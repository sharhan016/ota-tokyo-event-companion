import { Navigation } from 'lucide-react';

interface LocateMeButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export function LocateMeButton({ onClick, isActive }: LocateMeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full shadow-lg 
        flex items-center justify-center transition-all active:scale-95
        ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white'
        }
      `}
    >
      <Navigation className="w-6 h-6" />
    </button>
  );
}
