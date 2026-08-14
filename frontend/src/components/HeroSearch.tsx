import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Location, PropertyType } from '../types';
import { getLocations, getPropertyTypes } from '../services/api';
import CustomSelect, { SelectOption } from './CustomSelect';

interface HeroSearchProps {
  locations?: Location[];
  propertyTypes?: PropertyType[];
}

export default function HeroSearch({ locations: initialLocations = [], propertyTypes: initialTypes = [] }: HeroSearchProps) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(initialTypes);
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [location, setLocation] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [bedrooms] = useState<string>('');

  useEffect(() => {
    if (initialLocations.length > 0) {
      setLocations(initialLocations);
    } else {
      getLocations().then((res) => setLocations(res.data || [])).catch(() => {});
    }
  }, [initialLocations]);

  useEffect(() => {
    if (initialTypes.length > 0) {
      setPropertyTypes(initialTypes);
    } else {
      getPropertyTypes().then((res) => setPropertyTypes(res.data || [])).catch(() => {});
    }
  }, [initialTypes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.append('purpose', purpose);
    if (location) query.append('location', location);
    if (type) query.append('type', type);
    if (bedrooms) query.append('bedrooms', bedrooms);

    if (priceRange === 'under_2cr') {
      query.append('max_price', '20000000');
    } else if (priceRange === '2cr_5cr') {
      query.append('min_price', '20000000');
      query.append('max_price', '50000000');
    } else if (priceRange === 'above_5cr') {
      query.append('min_price', '50000000');
    }

    navigate(`/properties?${query.toString()}`);
  };

  const locationOptions: SelectOption[] = [
    { value: '', label: 'All Locations' },
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

  const budgetOptions: SelectOption[] = [
    { value: '', label: 'Any Budget' },
    { value: 'under_2cr', label: 'Under ₹2 Cr' },
    { value: '2cr_5cr', label: '₹2 Cr - ₹5 Cr' },
    { value: 'above_5cr', label: '₹5 Cr + Ultra Luxury' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto self-stretch bg-slate-900/90 backdrop-blur-xl p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-700/60 shadow-2xl shadow-black/80 box-border overflow-visible">
      {/* Purpose Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setPurpose('buy')}
          className={`relative flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors z-10 cursor-pointer text-center ${
            purpose === 'buy' ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          {purpose === 'buy' && (
            <motion.span
              layoutId="hero-purpose-pill"
              className="absolute inset-0 bg-amber-400 rounded-full shadow-md shadow-amber-400/20 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          BUY PROPERTY
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`relative flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors z-10 cursor-pointer text-center ${
            purpose === 'rent' ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          {purpose === 'rent' && (
            <motion.span
              layoutId="hero-purpose-pill"
              className="absolute inset-0 bg-amber-400 rounded-full shadow-md shadow-amber-400/20 -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          RENT PROPERTY
        </button>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(4,minmax(0,1fr))] gap-2.5 sm:gap-3 w-full">
        {/* Location Dropdown */}
        <div className="min-w-0 w-full bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-center focus-within:border-amber-400 transition-colors">
          <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider px-1 mb-0.5 flex items-center gap-1 shrink-0">
            <MapPin className="w-3 h-3 shrink-0" /> Location
          </label>
          <CustomSelect
            value={location}
            onChange={setLocation}
            options={locationOptions}
            placeholder="All Locations"
            variant="hero"
            searchable
          />
        </div>

        {/* Property Type Dropdown */}
        <div className="min-w-0 w-full bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-center focus-within:border-amber-400 transition-colors">
          <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider px-1 mb-0.5 flex items-center gap-1 shrink-0">
            <Home className="w-3 h-3 shrink-0" /> Property Type
          </label>
          <CustomSelect
            value={type}
            onChange={setType}
            options={propertyTypeOptions}
            placeholder="All Property Types"
            variant="hero"
          />
        </div>

        {/* Price Range Dropdown */}
        <div className="min-w-0 w-full bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col justify-center focus-within:border-amber-400 transition-colors">
          <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider px-1 mb-0.5 flex items-center gap-1 shrink-0">
            <DollarSign className="w-3 h-3 shrink-0" /> Budget Range
          </label>
          <CustomSelect
            value={priceRange}
            onChange={setPriceRange}
            options={budgetOptions}
            placeholder="Any Budget"
            variant="hero"
          />
        </div>

        {/* Submit Search Button */}
        <div className="min-w-0 w-full sm:col-span-2 md:col-span-1">
          <button
            type="submit"
            className="w-full h-full min-h-[46px] sm:min-h-[52px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
            <span>FIND HOMES</span>
          </button>
        </div>
      </form>
    </div>
  );
}
