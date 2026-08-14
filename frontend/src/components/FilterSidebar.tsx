import React from 'react';
import { Search, RotateCcw, Filter, MapPin, Building2, Sofa } from 'lucide-react';
import { Location, PropertyType, Amenity } from '../types';
import CustomSelect, { SelectOption } from './CustomSelect';

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

  // Dropdown options
  const locationOptions: SelectOption[] = [
    { value: '', label: 'All Cities & Regions' },
    ...locations.map((loc) => ({
      value: loc.slug,
      label: `${loc.city} (${loc.name})`,
      description: loc.state ? `${loc.state}, ${loc.country || 'India'}` : undefined,
    })),
  ];

  const propertyTypeOptions: SelectOption[] = [
    { value: '', label: 'All Property Types' },
    ...propertyTypes.map((t) => ({
      value: t.slug,
      label: t.name,
    })),
  ];

  const furnishingOptions: SelectOption[] = [
    { value: '', label: 'Any Furnishing' },
    { value: 'furnished', label: 'Fully Furnished' },
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' },
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Filter Search</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
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
              className={`py-1.5 rounded-lg font-semibold uppercase transition-all cursor-pointer ${
                filters.purpose === p
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === '' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      {/* City / Location Dropdown */}
      <CustomSelect
        label="City / Location"
        value={filters.location}
        onChange={(val) => handleInputChange('location', val)}
        options={locationOptions}
        placeholder="All Cities & Regions"
        icon={<MapPin className="w-3.5 h-3.5" />}
        searchable
      />

      {/* Property Type Dropdown */}
      <CustomSelect
        label="Property Type"
        value={filters.type}
        onChange={(val) => handleInputChange('type', val)}
        options={propertyTypeOptions}
        placeholder="All Property Types"
        icon={<Building2 className="w-3.5 h-3.5" />}
      />

      {/* Bedrooms */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2">Bedrooms</label>
        <div className="flex gap-1.5 text-xs">
          {['', '2', '3', '4', '5'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleInputChange('bedrooms', b)}
              className={`flex-1 py-2 rounded-xl font-semibold border transition-all cursor-pointer ${
                filters.bedrooms === b
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {b === '' ? 'Any' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing Dropdown */}
      <CustomSelect
        label="Furnishing"
        value={filters.furnished_status}
        onChange={(val) => handleInputChange('furnished_status', val)}
        options={furnishingOptions}
        placeholder="Any Furnishing"
        icon={<Sofa className="w-3.5 h-3.5" />}
      />

      {/* Amenities Checkboxes */}
      {amenitiesList.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Amenities</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 text-xs">
            {amenitiesList.map((a) => {
              const checked = filters.amenities?.includes(a.slug);
              return (
                <label
                  key={a.id}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAmenityToggle(a.slug)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-400 focus:ring-0 cursor-pointer"
                  />
                  <span>{a.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
