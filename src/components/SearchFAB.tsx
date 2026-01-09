import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Location } from '../types';

interface SearchFABProps {
  locations: Location[];
  onSelectLocation: (location: Location) => void;
}

export function SearchFAB({ locations, onSelectLocation }: SearchFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const searchResults = query.trim()
    ? locations.filter(
        (loc) =>
          loc.label.toLowerCase().includes(query.toLowerCase()) ||
          loc.details.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (location: Location) => {
    onSelectLocation(location);
    setQuery('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-4 right-4 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
      >
        <Search className="w-5 h-5 text-gray-700" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 left-4 z-30 max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations, vendors, events..."
            autoFocus
            className="w-full pl-12 pr-12 py-3 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={() => {
              setIsExpanded(false);
              setQuery('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-xl">
            {searchResults.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-white/60 transition-colors rounded-lg"
              >
                <div className="font-medium text-gray-900">{location.label}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {location.details}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
