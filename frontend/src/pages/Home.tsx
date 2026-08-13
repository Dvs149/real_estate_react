import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import PropertyCard from '../components/PropertyCard';
import { getProperties, getLocations, getPropertyTypes, getAgents, getBlogs, getTestimonials } from '../services/api';
import { Property, Location, PropertyType, Agent, Blog, Testimonial } from '../types';
import { ShieldCheck, Award, Sparkles, Building2, ArrowRight, Star, Loader2 } from 'lucide-react';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProperties({ featured: true, per_page: 6 }).catch(() => ({ data: [] })),
      getLocations().catch(() => ({ data: [] })),
      getPropertyTypes().catch(() => ({ data: [] })),
      getAgents().catch(() => ({ data: [] })),
      getBlogs().catch(() => ({ data: [] })),
      getTestimonials().catch(() => ({ data: [] })),
    ])
      .then(([propsRes, locsRes, typesRes, agentsRes, blogsRes, testRes]) => {
        setFeaturedProperties(propsRes.data || []);
        setLocations(locsRes.data || []);
        setPropertyTypes(typesRes.data || []);
        setAgents(agentsRes.data || []);
        setBlogs((blogsRes.data || []).slice(0, 3));
        setTestimonials(testRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-28 sm:pt-36 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Real Estate Hero"
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl w-full mx-auto text-center space-y-4 sm:space-y-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">UNRIVALED LUXURY REAL ESTATE MARKETPLACE</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Sanctuary Of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              Extraordinary Living
            </span>
          </h1>

          <p className="text-xs sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed px-2">
            Discover architectural masterworks, sky penthouses, private beach villas, and high-yield commercial estates across India's finest addresses.
          </p>

          {/* Hero Search Widget */}
          <div className="pt-2 sm:pt-4 w-full">
            <HeroSearch locations={locations} propertyTypes={propertyTypes} />
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Signature Collection
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Featured Residences</h2>
          </div>
          <Link
            to="/properties?featured=true"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            Explore All Listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-xs">Loading featured residences...</p>
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">No featured properties found at this moment.</div>
        )}
      </section>

      {/* POPULAR LOCATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Prime Destinations</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Explore Top Metros</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              to={`/properties?location=${loc.slug}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-slate-800 shadow-xl"
            >
              <img
                src={loc.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600'}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="text-xl font-bold">{loc.city}</h3>
                <p className="text-xs text-amber-300 font-medium">Explore Listings →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section className="bg-slate-900/60 border-y border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Tailored Living</span>
            <h2 className="text-3xl font-bold text-white">Browse By Property Category</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {propertyTypes.map((pt) => (
              <Link
                key={pt.id}
                to={`/properties?type=${pt.slug}`}
                className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/50 transition-all hover:-translate-y-1 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{pt.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{pt.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Unmatched Expertise</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Why Discerning Buyers Choose DVS Realty
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We redefine luxury real estate transactions with discreet advisory, institutional legal due diligence, and bespoke concierge services for high-net-worth clients worldwide.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white text-base">100% RERA & Title Verified</h4>
                  <p className="text-xs text-slate-400">Every property passes rigorous legal audits before publication.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <Award className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white text-base">Private VIP Concierge</h4>
                  <p className="text-xs text-slate-400">Chauffeur-driven walkthroughs and private helicopter tours available.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] border border-slate-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200"
              alt="Luxury Estate Advisory"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURED AGENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Senior Advisors</span>
            <h2 className="text-3xl font-bold text-white">Meet Our Luxury Agents</h2>
          </div>
          <Link to="/agents" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
            View All Agents →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.slug}`}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl hover:border-amber-400/40 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <img
                  src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                  alt={agent.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-amber-400/50 shadow-lg group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{agent.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{agent.agency_name}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 pt-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="font-bold text-white">{agent.rating}</span>
                    <span>({agent.experience_years} Yrs Exp)</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{agent.bio}</p>
              </div>

              <div className="pt-2">
                <span className="w-full py-3 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs group-hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20">
                  View Profile & Listings <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-slate-900/40 py-16 border-y border-slate-900">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Client Voices</span>
            <h2 className="text-3xl font-bold text-white">Trusted By Homeowners Worldwide</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {testimonials.map((t) => (
                <div key={t.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.role} ({t.company})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG ARTICLES */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Real Estate Journal</span>
              <h2 className="text-3xl font-bold text-white">Market Insights & Trends</h2>
            </div>
            <Link to="/blog" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
              Read Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <Link key={b.id} to={`/blog/${b.slug}`} className="group space-y-4">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={b.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-xs text-amber-400 font-semibold">{b.category?.name}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mt-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{b.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-6 sm:p-14 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready To Find Your Dream Residence?</h2>
            <p className="text-slate-900 text-xs sm:text-base font-medium">
              Consult with our senior advisors for private off-market penthouses, villas, and investment opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/properties"
              className="px-6 py-3.5 rounded-2xl bg-slate-950 text-white font-bold text-xs sm:text-sm hover:bg-slate-900 transition-colors shadow-xl text-center"
            >
              Browse Properties
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-2xl bg-slate-900/20 text-slate-950 border border-slate-950/30 font-bold text-xs sm:text-sm hover:bg-slate-900/30 transition-colors text-center"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
