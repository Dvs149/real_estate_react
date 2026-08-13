'use client';

import React, { useState } from 'react';
import { Property } from '../types';
import { X, Layers, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PropertyCompareProps {
  selectedProperties: Property[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function PropertyCompare({ selectedProperties, onRemove, onClear }: PropertyCompareProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (selectedProperties.length === 0) return null;

  return (
    <>
      {/* Floating Bar at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 text-xs text-white">
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <Layers className="w-4 h-4" />
          <span>Compare ({selectedProperties.length}/4)</span>
        </div>

        <div className="flex items-center gap-2 border-x border-slate-800 px-3">
          {selectedProperties.map((p) => (
            <div key={p.id} className="relative group flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              <span className="max-w-[100px] truncate">{p.title}</span>
              <button
                onClick={() => onRemove(p.id)}
                className="text-slate-500 hover:text-rose-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
          >
            Compare Specs
          </button>
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-white underline text-[11px]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Comparison Drawer / Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Property Specifications Comparison</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {selectedProperties.map((p) => (
                <div key={p.id} className="space-y-4 pt-4 md:pt-0 md:px-3">
                  <img
                    src={p.primary_image || p.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400'}
                    alt={p.title}
                    className="w-full aspect-[4/3] object-cover rounded-2xl border border-slate-800"
                  />

                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{p.title}</h4>
                    <p className="text-amber-400 font-mono font-bold text-base mt-0.5">{p.formatted_price}</p>
                    <p className="text-xs text-slate-400">{p.location?.city} ({p.location?.name})</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Property Type:</span>
                      <span className="font-medium text-white">{p.property_type?.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Bedrooms:</span>
                      <span className="font-medium text-white">{p.bedrooms} Beds</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Bathrooms:</span>
                      <span className="font-medium text-white">{p.bathrooms} Baths</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Area:</span>
                      <span className="font-medium text-white">{p.area_sqft} sqft</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Furnishing:</span>
                      <span className="font-medium text-white capitalize">{p.furnished_status}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Year Built:</span>
                      <span className="font-medium text-white">{p.year_built}</span>
                    </div>
                  </div>

                  <Link
                    href={`/properties/${p.slug}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    View Listing <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
