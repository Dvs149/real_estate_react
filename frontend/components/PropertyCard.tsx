'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property } from '../types';
import { Bed, Bath, Maximize2, MapPin, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { toggleFavorite } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: number, isFav: boolean) => void;
}

export default function PropertyCard({ property, onFavoriteToggle }: PropertyCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(!!property.is_favorite);
  const [favLoading, setFavLoading] = useState<boolean>(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setFavLoading(true);
    try {
      const res = await toggleFavorite(property.id);
      setIsFavorite(res.is_favorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, res.is_favorite);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const primaryImage =
    property.primary_image ||
    (property.images && property.images.length > 0 ? property.images[0].image_path : null) ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="group rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-400/40 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                property.purpose === 'buy'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-400 text-slate-950'
              }`}
            >
              For {property.purpose}
            </span>
            {property.is_featured && (
              <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured
              </span>
            )}
          </div>

          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30'
                : 'bg-slate-900/70 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Property Type Pill */}
        <div className="absolute bottom-3 left-4 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[11px] font-medium">
            {property.property_type?.name || 'Property'}
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Location */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="text-xl font-bold text-amber-400 font-mono tracking-tight">
              {property.formatted_price}
              {property.purpose === 'rent' && <span className="text-xs text-slate-400 font-normal"> / mo</span>}
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              {property.location?.city}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.slug}`} className="group-hover:text-amber-300 transition-colors">
            <h3 className="text-base font-semibold text-white line-clamp-1 mb-1 leading-snug">
              {property.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-1 mb-4">
            {property.address}
          </p>
        </div>

        {/* Specs & Footer */}
        <div>
          <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 mb-4">
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-amber-400/80" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center border-x border-slate-800">
              <Bath className="w-4 h-4 text-amber-400/80" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{property.area_sqft} sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <img
                src={property.agent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100'}
                alt={property.agent?.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-700"
              />
              <span className="text-xs text-slate-400 max-w-[120px] truncate">{property.agent?.name}</span>
            </div>

            <Link
              href={`/properties/${property.slug}`}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View Listing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
