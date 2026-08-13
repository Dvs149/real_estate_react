import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAgents } from '../services/api';
import { Agent } from '../types';
import { Star, ArrowRight, Loader2 } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAgents()
      .then((res) => setAgents(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Prestige Advisors</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Luxury Real Estate Agents</h1>
        <p className="text-sm text-slate-400">
          Connect with top-performing senior advisors specialized in high-end penthouses, private beach villas, and commercial assets.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm">Loading agents directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.slug}`}
              className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl hover:border-amber-400/40 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <img
                  src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'}
                  alt={agent.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-amber-400/50 shadow-lg group-hover:scale-105 transition-transform"
                />

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">{agent.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{agent.agency_name}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 pt-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
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
      )}
    </div>
  );
}
