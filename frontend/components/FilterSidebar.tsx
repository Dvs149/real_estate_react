'use client';

import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { Location, PropertyType, Amenity } from '../types';

interface FilterSidebarProps {
  filters: {
    q: string;
    purpose: string;
    location: string;
    type: string;
    min_price: string;
    max_price: string;
    bedrooms: string;
    bathrooms: string;
    furnished_status: string;
    amenities: string[];
    sort: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  locations: Location[];
  propertyTypes: PropertyType[];
  amenitiesList: Amenity[];
  onReset: () => void;
}

export default function FilterSidebar({
  filters,
  setFilters,
  locations,
  propertyTypes,
  amenitiesList,
  onReset,
}: FilterSidebarProps) {
  const handleInputChange = (field: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (slug: string) => {
    setFilters((prev: any) => {
      const current = prev.amenities || [];
      const updated = current.includes(slug)
        ? current.filter((item: string) => item !== slug)
        : [...current, slug];
      return { ...prev, amenities: updated };
    });
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Filter Search</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Keyword Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search location, title..."
            value={filters.q}
            onChange={(e) => handleInputChange('q', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Purpose</label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {['', 'buy', 'rent'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleInputChange('purpose', p)}
              className={`py-1.5 rounded-lg font-semibold uppercase transition-all ${
                filters.purpose === p
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === '' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      {/* City / Location */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">City / Location</label>
        <select
          value={filters.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="">All Cities</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.slug}>
              {loc.city} ({loc.name})
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Property Type</label>
        <select
          value={filters.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="">All Property Types</option>
          {propertyTypes.map((pt) => (
            <option key={pt.id} value={pt.slug}>
              {pt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Bedrooms</label>
        <div className="flex gap-2">
          {['', '2', '3', '4', '5'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleInputChange('bedrooms', b)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                filters.bedrooms === b
                  ? 'bg-amber-400 border-amber-400 text-slate-950'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {b === '' ? 'Any' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Furnished Status */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Furnishing</label>
        <select
          value={filters.furnished_status}
          onChange={(e) => handleInputChange('furnished_status', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="">Any Furnishing</option>
          <option value="furnished">Fully Furnished</option>
          <option value="semi-furnished">Semi-Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Amenities */}
      {amenitiesList.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2.5">Amenities</label>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {amenitiesList.map((amenity) => {
              const checked = (filters.amenities || []).includes(amenity.slug);
              return (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAmenityToggle(amenity.slug)}
                    className="rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400 focus:ring-offset-slate-900"
                  />
                  <span>{amenity.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
