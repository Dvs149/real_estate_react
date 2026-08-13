import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { X, Layers, ArrowRight } from 'lucide-react';

interface PropertyCompareProps {
  selectedProperties: Property[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function PropertyCompare({ selectedProperties, onRemove, onClear }: PropertyCompareProps) {
  if (selectedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-3xl p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Compare Properties</h4>
            <p className="text-[11px] text-slate-400">{selectedProperties.length} of 3 listings selected</p>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto">
          {selectedProperties.map((p) => (
            <div key={p.id} className="relative group shrink-0">
              <img
                src={p.primary_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'}
                alt={p.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <button
                onClick={() => onRemove(p.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg"
          >
            Clear
          </button>
          <Link
            to="/properties"
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 flex items-center gap-1 shadow-lg shadow-amber-400/20"
          >
            Compare Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
