'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, DollarSign, Bed, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Location, PropertyType } from '../types';
import { getLocations, getPropertyTypes } from '../services/api';

interface HeroSearchProps {
  locations?: Location[];
  propertyTypes?: PropertyType[];
}

export default function HeroSearch({ locations: initialLocations = [], propertyTypes: initialTypes = [] }: HeroSearchProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(initialTypes);
  const [purpose, setPurpose] = useState<'buy' | 'rent'>('buy');
  const [location, setLocation] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');

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

    router.push(`/properties?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-700/60 shadow-2xl shadow-black/80">
      {/* Purpose Tabs */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setPurpose('buy')}
          className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors z-10 ${
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
          className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors z-10 ${
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
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Location Dropdown */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-center focus-within:border-amber-400 transition-colors">
          <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-300">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.slug} className="bg-slate-900 text-white">
                {loc.city} ({loc.name})
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-center focus-within:border-amber-400 transition-colors">
          <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <Home className="w-3 h-3" /> Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-300">All Property Types</option>
            {propertyTypes.map((t) => (
              <option key={t.id} value={t.slug} className="bg-slate-900 text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Dropdown */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-center focus-within:border-amber-400 transition-colors">
          <label className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Budget Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-300">Any Budget</option>
            <option value="under_2cr" className="bg-slate-900 text-white">Under ₹2 Cr</option>
            <option value="2cr_5cr" className="bg-slate-900 text-white">₹2 Cr - ₹5 Cr</option>
            <option value="above_5cr" className="bg-slate-900 text-white">₹5 Cr + Ultra Luxury</option>
          </select>
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="w-full h-full min-h-[52px] rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
          <span>FIND HOMES</span>
        </button>
      </form>
    </div>
  );
}
