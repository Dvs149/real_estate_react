import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAgentBySlug } from '../services/api';
import { Agent } from '../types';
import PropertyCard from '../components/PropertyCard';
import ContactAgentModal from '../components/ContactAgentModal';
import { Star, Award, Building2, Loader2, MessageSquare } from 'lucide-react';

export default function AgentDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [contactOpen, setContactOpen] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      getAgentBySlug(slug)
        .then((res) => setAgent(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm">Loading agent profile...</p>
      </div>
    );
  }

  if (!agent) {
    return <div className="py-20 text-center text-slate-400">Agent profile not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-12">
      {/* Profile Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
          alt={agent.name}
          className="w-36 h-36 rounded-full object-cover border-4 border-amber-400/50 shadow-2xl shrink-0"
        />

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">{agent.agency_name}</span>
            <h1 className="text-3xl font-extrabold text-white">{agent.name}</h1>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{agent.bio}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="font-bold text-white text-sm">{agent.rating} Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{agent.experience_years} Years Experience</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{agent.properties_count || agent.properties?.length || 0} Listed Properties</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={() => setContactOpen(true)}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" /> Direct Message Agent
          </button>
        </div>
      </div>

      {/* Properties by Agent */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Active Properties Listed By {agent.name}</h2>
        {agent.properties && agent.properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agent.properties.map((p) => (
              <PropertyCard key={p.id} property={p} showAgentInfo={false} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
            No active listings found for this agent at the moment.
          </div>
        )}
      </div>

      <ContactAgentModal
        agent={agent}
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
