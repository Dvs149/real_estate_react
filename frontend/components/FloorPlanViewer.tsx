'use client';

import React, { useState } from 'react';
import { PropertyFloorPlan } from '../types';
import { Layers } from 'lucide-react';

interface FloorPlanViewerProps {
  floorPlans: PropertyFloorPlan[];
}

export default function FloorPlanViewer({ floorPlans }: FloorPlanViewerProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!floorPlans || floorPlans.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-sm">
        Floor plan blueprint drawing available upon request from listing agent.
      </div>
    );
  }

  const currentPlan = floorPlans[activeTab] || floorPlans[0];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Architectural Floor Plan</h3>
        </div>

        {floorPlans.length > 1 && (
          <div className="flex gap-2">
            {floorPlans.map((fp, i) => (
              <button
                key={fp.id || i}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === i ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {fp.floor_name || `Floor ${i + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center">
        <img
          src={currentPlan.image_path}
          alt={currentPlan.title}
          className="max-h-full max-w-full object-contain p-4 filter brightness-90 hover:brightness-100 transition-all"
        />
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-amber-300 border border-slate-700 font-medium">
          {currentPlan.title}
        </div>
      </div>
    </div>
  );
}
