import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Pin, Vendor } from '../types';

interface SearchBarProps {
  pins: Pin[];
  onSelectResult: (pin: Pin) => void;
}

interface SearchResult {
  pin: Pin;
  matchedVendor?: Vendor;
  matchType: 'pin' | 'vendor';
}

export function SearchBar({ pins, onSelectResult }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    pins.forEach(pin => {
      // Search in pin name
      if (pin.name.toLowerCase().includes(lowerQuery)) {
        results.push({ pin, matchType: 'pin' });
      }

      // Search in vendors
      pin.vendors.forEach(vendor => {
        if (vendor.name.toLowerCase().includes(lowerQuery)) {
          results.push({ pin, matchedVendor: vendor, matchType: 'vendor' });
        }
      });
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [query, pins]);

  const handleSelect = (result: SearchResult) => {
    onSelectResult(result.pin);
    setQuery('');
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search venues, vendors, events..."
          className="w-full pl-12 pr-12 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isFocused && searchResults.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsFocused(false)}
          />
          <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-20 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={`${result.pin.id}-${index}`}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">
                  {result.matchedVendor ? result.matchedVendor.name : result.pin.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {result.matchedVendor ? `at ${result.pin.name}` : result.pin.description}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
