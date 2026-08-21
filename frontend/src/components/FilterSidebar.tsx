import React from 'react';
import { Search, RotateCcw, Filter, MapPin, Building2, Sofa, IndianRupee } from 'lucide-react';
import { Location, PropertyType, Amenity } from '../types';
import CustomSelect, { SelectOption } from './CustomSelect';

function formatPriceLabel(num: number): string {
  if (!num || isNaN(num)) return '';
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakhs`;
  }
  if (num >= 1000) {
    return `₹ ${(num / 1000).toFixed(0)}k`;
  }
  return `₹ ${num}`;
}

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
  const [filterConfig, setFilterConfig] = React.useState<Record<string, boolean>>({
    keyword: true,
    purpose: true,
    location: true,
    property_type: true,
    price_range: true,
    bedrooms: true,
    furnishing: true,
    amenities: true,
  });
  const [customAmenities, setCustomAmenities] = React.useState<Amenity[]>([]);

  React.useEffect(() => {
    const loadSettings = () => {
      import('../services/api').then(({ getSettings }) => {
        getSettings().then((settings) => {
          if (settings.filter_sidebar_config) {
            try {
              const parsed = JSON.parse(settings.filter_sidebar_config);
              if (Array.isArray(parsed)) {
                const map: Record<string, boolean> = {};
                parsed.forEach((item: any) => {
                  map[item.id] = item.enabled !== false;
                });
                setFilterConfig((prev) => ({ ...prev, ...map }));
              }
            } catch (e) {}
          }
          if (settings.custom_amenities_config) {
            try {
              const parsedCustom = JSON.parse(settings.custom_amenities_config);
              if (Array.isArray(parsedCustom)) {
                setCustomAmenities(parsedCustom.filter((item: any) => item.enabled !== false));
              }
            } catch (e) {}
          }
        }).catch(() => {});
      });
    };

    loadSettings();

    const handleUpdate = (e: any) => {
      const settings = e.detail;
      if (settings?.filter_sidebar_config) {
        try {
          const parsed = JSON.parse(settings.filter_sidebar_config);
          if (Array.isArray(parsed)) {
            const map: Record<string, boolean> = {};
            parsed.forEach((item: any) => {
              map[item.id] = item.enabled !== false;
            });
            setFilterConfig((prev) => ({ ...prev, ...map }));
          }
        } catch (e) {}
      }
      if (settings?.custom_amenities_config) {
        try {
          const parsedCustom = JSON.parse(settings.custom_amenities_config);
          if (Array.isArray(parsedCustom)) {
            setCustomAmenities(parsedCustom.filter((item: any) => item.enabled !== false));
          }
        } catch (e) {}
      }
    };

    window.addEventListener('siteSettingsUpdated', handleUpdate);
    return () => window.removeEventListener('siteSettingsUpdated', handleUpdate);
  }, []);

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

  const mergedAmenities = [
    ...amenitiesList,
    ...customAmenities.filter((c) => !amenitiesList.some((a) => a.slug === c.slug || a.name === c.name)),
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
      {filterConfig.keyword !== false && (
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
      )}

      {/* Purpose */}
      {filterConfig.purpose !== false && (
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
      )}

      {/* City / Location Dropdown */}
      {filterConfig.location !== false && (
        <CustomSelect
          label="City / Location"
          value={filters.location}
          onChange={(val) => handleInputChange('location', val)}
          options={locationOptions}
          placeholder="All Cities & Regions"
          icon={<MapPin className="w-3.5 h-3.5" />}
          searchable
        />
      )}

      {/* Property Type Dropdown */}
      {filterConfig.property_type !== false && (
        <CustomSelect
          label="Property Type"
          value={filters.type}
          onChange={(val) => handleInputChange('type', val)}
          options={propertyTypeOptions}
          placeholder="All Property Types"
          icon={<Building2 className="w-3.5 h-3.5" />}
        />
      )}

      {/* Price Range (Min & Max) */}
      {filterConfig.price_range !== false && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              Price Range
            </label>
            {(filters.min_price || filters.max_price) && (
              <button
                type="button"
                onClick={() => setFilters((prev: any) => ({ ...prev, min_price: '', max_price: '' }))}
                className="text-[10px] text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Clear Price
              </button>
            )}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.min_price}
                  onChange={(e) => handleInputChange('min_price', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <span className="absolute left-2.5 top-2 text-slate-500 text-xs">₹</span>
              </div>
              {filters.min_price && (
                <span className="text-[10px] text-amber-400 font-mono font-semibold block mt-1 truncate">
                  {formatPriceLabel(Number(filters.min_price))}
                </span>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.max_price}
                  onChange={(e) => handleInputChange('max_price', e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <span className="absolute left-2.5 top-2 text-slate-500 text-xs">₹</span>
              </div>
              {filters.max_price && (
                <span className="text-[10px] text-amber-400 font-mono font-semibold block mt-1 truncate">
                  {formatPriceLabel(Number(filters.max_price))}
                </span>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {filters.purpose === 'rent'
              ? [
                  { label: '< ₹50k', min: '', max: '50000' },
                  { label: '₹50k-1.5L', min: '50000', max: '150000' },
                  { label: '₹1.5L-3L', min: '150000', max: '300000' },
                  { label: '₹3L+', min: '300000', max: '' },
                ].map((preset, idx) => {
                  const isActive = filters.min_price === preset.min && filters.max_price === preset.max;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFilters((prev: any) => ({ ...prev, min_price: preset.min, max_price: preset.max, page: '1' }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })
              : [
                  { label: '< ₹50L', min: '', max: '5000000' },
                  { label: '₹50L-2Cr', min: '5000000', max: '20000000' },
                  { label: '₹2Cr-10Cr', min: '20000000', max: '100000000' },
                  { label: '₹10Cr+', min: '100000000', max: '' },
                ].map((preset, idx) => {
                  const isActive = filters.min_price === preset.min && filters.max_price === preset.max;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFilters((prev: any) => ({ ...prev, min_price: preset.min, max_price: preset.max, page: '1' }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
          </div>
        </div>
      )}

      {/* Bedrooms */}
      {filterConfig.bedrooms !== false && (
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
      )}

      {/* Furnishing Dropdown */}
      {filterConfig.furnishing !== false && (
        <CustomSelect
          label="Furnishing"
          value={filters.furnished_status}
          onChange={(val) => handleInputChange('furnished_status', val)}
          options={furnishingOptions}
          placeholder="Any Furnishing"
          icon={<Sofa className="w-3.5 h-3.5" />}
        />
      )}

      {/* Amenities Checkboxes */}
      {filterConfig.amenities !== false && mergedAmenities.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Amenities</label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 text-xs">
            {mergedAmenities.map((a) => {
              const checked = filters.amenities?.includes(a.slug);
              return (
                <label
                  key={a.id || a.slug}
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
