import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCompare from '../components/PropertyCompare';
import { getProperties, getLocations, getPropertyTypes, getAmenities } from '../services/api';
import { Property, Location, PropertyType, Amenity } from '../types';
import { LayoutGrid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import CustomSelect, { SelectOption } from '../components/CustomSelect';

const sortOptions: SelectOption[] = [
  { value: 'newest', label: 'Sort By: Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Viewed' },
];

export default function Properties() {
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    purpose: searchParams.get('purpose') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    furnished_status: searchParams.get('furnished_status') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
  });

  useEffect(() => {
    Promise.all([
      getLocations().then((res) => setLocations(res.data)).catch(() => {}),
      getPropertyTypes().then((res) => setPropertyTypes(res.data)).catch(() => {}),
      getAmenities().then((res) => setAmenitiesList(res.data)).catch(() => {}),
    ]);
  }, []);

  useEffect(() => {
    setFilters({
      q: searchParams.get('q') || '',
      purpose: searchParams.get('purpose') || '',
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      furnished_status: searchParams.get('furnished_status') || '',
      amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
      sort: searchParams.get('sort') || 'newest',
      page: searchParams.get('page') || '1',
    });
  }, [searchParams]);

  useEffect(() => {
    fetchPropertyList();
  }, [filters]);

  const fetchPropertyList = async () => {
    setLoading(true);
    try {
      const res = await getProperties({
        ...filters,
        per_page: 9,
      });
      setProperties(res.data || []);
      setMeta(res.meta);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      purpose: '',
      location: '',
      type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      furnished_status: '',
      amenities: [],
      sort: 'newest',
      page: '1',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Real Estate Marketplace</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse premium properties for buy or rent with real-time multi-criteria filtering.
          </p>
        </div>

        {/* Sorting & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            Filters
          </button>

          <CustomSelect
            value={filters.sort}
            onChange={(val) => setFilters((prev) => ({ ...prev, sort: val, page: '1' }))}
            options={sortOptions}
            placeholder="Sort By..."
            variant="compact"
            className="w-48 sm:w-56"
          />

          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            locations={locations}
            propertyTypes={propertyTypes}
            amenitiesList={amenitiesList}
            onReset={handleResetFilters}
          />
        </div>

        {/* Properties Container */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-sm font-medium">Filtering luxury properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
              <p className="text-lg font-semibold text-white">No properties match your current search criteria.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range, selecting different locations, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              {[...Array(meta.last_page)].map((_, i) => {
                const pageNum = String(i + 1);
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      filters.page === pageNum
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/40'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Compare Drawer */}
      <PropertyCompare
        selectedProperties={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setCompareList([])}
      />
    </div>
  );
}
