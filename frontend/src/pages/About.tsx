import React from 'react';
import { ShieldCheck, Award, Globe2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Our Legacy & Mission</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Redefining High-End Real Estate Advisory Across India
        </h1>
        <p className="text-base text-slate-300 font-light leading-relaxed">
          Founded on principles of absolute transparency, architectural appreciation, and institutional legal due diligence, DVS Realty connects global homebuyers with India's most extraordinary residences.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-extrabold text-amber-400 font-mono">₹1,500+ Cr</span>
          <span className="text-xs text-slate-400 block font-medium">Transaction Value</span>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-extrabold text-amber-400 font-mono">500+</span>
          <span className="text-xs text-slate-400 block font-medium">Luxury Residences Delivered</span>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-extrabold text-amber-400 font-mono">100%</span>
          <span className="text-xs text-slate-400 block font-medium">RERA & Title Clearances</span>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-extrabold text-amber-400 font-mono">4.95 / 5</span>
          <span className="text-xs text-slate-400 block font-medium">Client Satisfaction Index</span>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <ShieldCheck className="w-10 h-10 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Discreet Off-Market Portfolio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gain access to confidential penthouses, celebrity estates, and private beachfront villas not publicly listed on traditional platforms.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <Award className="w-10 h-10 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Architectural Curators</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We evaluate properties based on structural integrity, natural ventilation, lighting orientation, and long-term resale liquidity.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <Globe2 className="w-10 h-10 text-amber-400" />
          <h3 className="text-xl font-bold text-white">NRI & Global Investor Desk</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            End-to-end repatriation advice, power of attorney execution, property management, and tax optimization for overseas buyers.
          </p>
        </div>
      </div>
    </div>
  );
}
