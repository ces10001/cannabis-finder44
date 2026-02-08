'use client';

import { X } from 'lucide-react';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLicenseType: string;
  setSelectedLicenseType: (type: string) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showOpenOnly: boolean;
  setShowOpenOnly: (show: boolean) => void;
  showDealsOnly: boolean;
  setShowDealsOnly: (show: boolean) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'flower', label: 'Flower' },
  { value: 'vapes', label: 'Vapes' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'concentrates', label: 'Concentrates' },
  { value: 'pre-rolls', label: 'Pre-Rolls' },
];

const licenseTypes = [
  { value: '', label: 'All Types' },
  { value: 'recreational', label: 'Recreational' },
  { value: 'medical', label: 'Medical' },
  { value: 'both', label: 'Both' },
];

export function FilterPanel({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLicenseType,
  setSelectedLicenseType,
  maxDistance,
  setMaxDistance,
  priceRange,
  setPriceRange,
  showOpenOnly,
  setShowOpenOnly,
  showDealsOnly,
  setShowDealsOnly,
  onClearFilters,
  isMobile,
  onClose,
}: FilterPanelProps) {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          placeholder="Search dispensaries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">License Type</label>
        <select
          value={selectedLicenseType}
          onChange={(e) => setSelectedLicenseType(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {licenseTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Max Distance: {maxDistance} mi
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="200"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            min="0"
            max="200"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOpenOnly}
            onChange={(e) => setShowOpenOnly(e.target.checked)}
            className="w-4 h-4 rounded accent-primary-500"
          />
          <span className="text-sm">Open Now</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDealsOnly}
            onChange={(e) => setShowDealsOnly(e.target.checked)}
            className="w-4 h-4 rounded accent-primary-500"
          />
          <span className="text-sm">Has Deals</span>
        </label>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}
