import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-300">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-xl shadow-amber-400/10">
          <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading DVS Realty...</p>
    </div>
  );
}
