import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { Bed, Bath, Maximize2, MapPin, Heart, Sparkles, Star, ChevronRight } from 'lucide-react';
import { toggleFavorite } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: number, isFav: boolean) => void;
}

export default function PropertyCard({ property, onFavoriteToggle }: PropertyCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(!!property.is_favorite);
  const [favLoading, setFavLoading] = useState<boolean>(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    navigate(`/properties/${property.slug}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
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

  const agent = property.agent;
  const agentName = agent?.name || 'Luxury Specialist';
  const agentSlug = agent?.slug || '';
  const agentAvatar =
    agent?.avatar ||
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200';
  const agencyName = agent?.agency_name || 'DVS Luxury Real Estate';
  const experience = agent?.experience_years ? `${agent.experience_years} Yrs Exp` : '5+ Yrs Exp';
  const rating = agent?.rating ? Number(agent.rating).toFixed(1) : '4.9';
  const propertiesCount = agent?.properties_count || 12;

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-400/40 relative shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-slate-950">
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
            className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
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
            <div className="text-xl font-bold text-amber-400 font-mono tracking-tight whitespace-nowrap">
              {property.formatted_price}
              {property.purpose === 'rent' && <span className="text-xs text-slate-400 font-normal whitespace-nowrap"> / mo</span>}
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              {property.location?.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1 leading-snug">
            {property.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1 mb-4">
            {property.address}
          </p>
        </div>

        {/* Specs & Footer */}
        <div>
          <div className="flex items-center justify-between divide-x divide-slate-800/80 rounded-2xl bg-slate-950/70 border border-slate-800/80 py-2 px-1.5 text-[11px] sm:text-xs text-slate-300 mb-4 shadow-inner relative">
            {/* Bedrooms Item */}
            <div
              title={`${property.bedrooms} Bedrooms`}
              className="group/tooltip relative flex-1 flex items-center justify-center gap-1.5 px-1 py-0.5 min-w-0"
            >
              <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="truncate whitespace-nowrap">
                <strong className="text-white font-bold">{property.bedrooms}</strong>{' '}
                <span className="text-slate-400 text-[10px] sm:text-xs">Beds</span>
              </span>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900/95 border border-amber-400/40 text-amber-300 text-[11px] font-semibold rounded-xl shadow-2xl shadow-black/90 backdrop-blur-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap flex items-center gap-1.5 scale-95 group-hover/tooltip:scale-100">
                <Bed className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{property.bedrooms} Bedrooms</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-400/40" />
              </div>
            </div>

            {/* Bathrooms Item */}
            <div
              title={`${property.bathrooms} Bathrooms`}
              className="group/tooltip relative flex-1 flex items-center justify-center gap-1.5 px-1 py-0.5 min-w-0"
            >
              <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="truncate whitespace-nowrap">
                <strong className="text-white font-bold">{property.bathrooms}</strong>{' '}
                <span className="text-slate-400 text-[10px] sm:text-xs">Baths</span>
              </span>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900/95 border border-amber-400/40 text-amber-300 text-[11px] font-semibold rounded-xl shadow-2xl shadow-black/90 backdrop-blur-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap flex items-center gap-1.5 scale-95 group-hover/tooltip:scale-100">
                <Bath className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{property.bathrooms} Bathrooms</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-400/40" />
              </div>
            </div>

            {/* Area Sq Ft Item */}
            <div
              title={`${property.area_sqft ? Number(property.area_sqft).toLocaleString() : '—'} sq ft`}
              className="group/tooltip relative flex-[1.25] flex items-center justify-center gap-1.5 px-1 py-0.5 min-w-0"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="truncate whitespace-nowrap">
                <strong className="text-white font-bold">{property.area_sqft ? Number(property.area_sqft).toLocaleString() : '—'}</strong>{' '}
                <span className="text-slate-400 text-[10px] sm:text-xs">sq ft</span>
              </span>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900/95 border border-amber-400/40 text-amber-300 text-[11px] font-semibold rounded-xl shadow-2xl shadow-black/90 backdrop-blur-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap flex items-center gap-1.5 scale-95 group-hover/tooltip:scale-100">
                <Maximize2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{property.area_sqft ? Number(property.area_sqft).toLocaleString() : '—'} Square Feet</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-400/40" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
            {/* Agent Hover Card Container */}
            <div className="group/agent relative min-w-0 flex-1">
              <div className="flex items-center gap-2 cursor-pointer min-w-0" title={agentName}>
                <img
                  src={agentAvatar}
                  alt={agentName}
                  className="w-6.5 h-6.5 rounded-full object-cover border border-slate-700 group-hover/agent:border-amber-400 group-hover/agent:ring-2 group-hover/agent:ring-amber-400/20 transition-all duration-200 shrink-0"
                />
                <span className="text-xs text-slate-300 group-hover/agent:text-amber-300 transition-colors truncate font-medium min-w-0">
                  {agentName}
                </span>
              </div>

              {/* Floating Agent Card Popover on Hover */}
              <div className="absolute bottom-full -left-2 mb-2 z-50 w-[270px] max-w-[calc(100vw-3rem)] p-3.5 bg-slate-900/95 border border-amber-400/50 rounded-2xl shadow-2xl shadow-black/95 backdrop-blur-xl opacity-0 pointer-events-none group-hover/agent:opacity-100 group-hover/agent:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover/agent:translate-y-0 scale-95 group-hover/agent:scale-100 space-y-3 before:absolute before:top-full before:h-4 before:left-0 before:right-0 before:content-['']">
                {/* Arrow Pointer Down */}
                <div className="absolute top-full left-5 border-6 border-transparent border-t-slate-900" />
                <div className="absolute top-full left-5 border-6 border-transparent border-t-amber-400/50 -z-10" />

                {/* Header */}
                <div className="flex items-start gap-2.5 border-b border-slate-800 pb-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={agentAvatar}
                      alt={agentName}
                      className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400/80 shadow-md"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold"
                      title="Verified Agent"
                    >
                      ✓
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{agentName}</h4>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/30 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 shrink-0" />
                        <span>{rating}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{agencyName}</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Verified Agent Specialist
                    </span>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-medium">Experience</span>
                    <span className="font-bold text-white text-xs">{experience}</span>
                  </div>
                  <div className="space-y-0.5 border-l border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Active Portfolio</span>
                    <span className="font-bold text-amber-400 text-xs">{propertiesCount}+ Listings</span>
                  </div>
                </div>

                {/* Profile Link Button */}
                {agentSlug ? (
                  <Link
                    to={`/agents/${agentSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
                  >
                    <span>View Agent Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div className="text-[11px] text-slate-400 text-center font-medium py-1">
                    Licensed Real Estate Specialist
                  </div>
                )}
              </div>
            </div>

            <span className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 whitespace-nowrap shrink-0">
              View Listing →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
