import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import FloorPlanViewer from '../components/FloorPlanViewer';
import ContactAgentModal from '../components/ContactAgentModal';
import ScheduleVisitModal from '../components/ScheduleVisitModal';
import PropertyCard from '../components/PropertyCard';
import { getPropertyBySlug, getProperties } from '../services/api';
import { Property } from '../types';
import { MapPin, Bed, Bath, Maximize2, Calendar, ShieldCheck, Video, PhoneCall, CalendarPlus, ChevronLeft, Loader2, Sparkles } from 'lucide-react';

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getPropertyBySlug(slug)
        .then((res) => {
          setProperty(res.data);
          if (res.data.location?.slug) {
            getProperties({ location: res.data.location.slug, per_page: 3 })
              .then((simRes) => {
                setSimilarProperties((simRes.data || []).filter((p) => p.id !== res.data.id));
              })
              .catch(() => {});
          }
        })
        .catch((err) => {
          console.error('Error fetching property detail:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Property Not Found</h1>
        <p className="text-sm text-slate-400">The requested property listing may have been sold or removed.</p>
        <button
          onClick={() => navigate('/properties')}
          className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
        >
          Back To Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-10">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Properties
        </button>
      </div>

      {/* Title & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider">
              For {property.purpose}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold text-xs">
              {property.property_type?.name}
            </span>
            {property.is_featured && (
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Featured
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {property.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            {property.address}, {property.location?.city}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Guide Price</span>
            <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
              {property.formatted_price}
              {property.purpose === 'rent' && <span className="text-sm font-normal text-slate-400"> / mo</span>}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
              Schedule Visit
            </button>
            <button
              onClick={() => setContactModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              Contact Agent
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={property.images} title={property.title} />

      {/* Main Grid: Details + Sticky Agent Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Key Features & Description */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="space-y-1">
              <Bed className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="text-xs text-slate-400 block">Bedrooms</span>
              <span className="text-lg font-bold text-white">{property.bedrooms} Beds</span>
            </div>
            <div className="space-y-1">
              <Bath className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="text-xs text-slate-400 block">Bathrooms</span>
              <span className="text-lg font-bold text-white">{property.bathrooms} Baths</span>
            </div>
            <div className="space-y-1">
              <Maximize2 className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="text-xs text-slate-400 block">Built Area</span>
              <span className="text-lg font-bold text-white">{property.area_sqft} sqft</span>
            </div>
            <div className="space-y-1">
              <Calendar className="w-6 h-6 text-amber-400 mx-auto" />
              <span className="text-xs text-slate-400 block">Year Built</span>
              <span className="text-lg font-bold text-white">{property.year_built}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-white">Property Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities Grid */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-xl font-bold text-white">Amenities & Lifestyle Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Tour Section */}
          {property.video_url && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Video Walkthrough Tour</h3>
              </div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <iframe
                  src={property.video_url}
                  title="Video Tour"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Floor Plans */}
          {property.floor_plans && property.floor_plans.length > 0 && (
            <FloorPlanViewer floorPlans={property.floor_plans} />
          )}
        </div>

        {/* Right Column: Agent Card */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="text-center space-y-3 border-b border-slate-800 pb-5">
              <img
                src={property.agent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'}
                alt={property.agent?.name}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-400/50"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{property.agent?.name}</h3>
                <p className="text-xs text-amber-400 font-medium">{property.agent?.agency_name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{property.agent?.experience_years} Years Experience • Rating {property.agent?.rating}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
                Book Private Visit
              </button>

              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                Inquire via Email/Phone
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-900 space-y-6">
          <h2 className="text-2xl font-bold text-white">Similar Luxury Residences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {property.agent && (
        <ContactAgentModal
          agent={property.agent}
          property={property}
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      )}

      <ScheduleVisitModal
        property={property}
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}
