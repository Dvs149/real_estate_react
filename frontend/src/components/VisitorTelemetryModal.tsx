import React from 'react';
import { X, Activity, Globe, MapPin, Clock, Monitor, Cpu, Compass, Hash, MonitorSmartphone, Languages, Link, Navigation, Target, Calendar, UserCheck, Shield } from 'lucide-react';
import { VisitorLog } from '../types';
import { formatDate } from '../utils/formatters';

interface VisitorTelemetryModalProps {
  log: VisitorLog | null;
  onClose: () => void;
}

export default function VisitorTelemetryModal({ log, onClose }: VisitorTelemetryModalProps) {
  if (!log) return null;

  const isNew = log.visitor_status === 'New Visitor';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0b1120] border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white tracking-tight">Visitor Telemetry Inspector</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isNew
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {log.visitor_status || 'VISITOR'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Hit Record #{log.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry 18 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {/* 1. IP Address */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> 1. IP Address
            </span>
            <p className="text-sm font-mono font-bold text-emerald-400 truncate">{log.ip_address}</p>
          </div>

          {/* 2. Country */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> 2. Country
            </span>
            <p className="text-sm font-bold text-white truncate">{log.country || 'India'}</p>
          </div>

          {/* 3. State / Region */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> 3. State / Region
            </span>
            <p className="text-sm font-bold text-white truncate">{log.state || 'Gujarat'}</p>
          </div>

          {/* 4. City */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 4. City
            </span>
            <p className="text-sm font-bold text-white truncate">{log.city || 'Ahmedabad'}</p>
          </div>

          {/* 5. Timezone */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> 5. Timezone
            </span>
            <p className="text-sm font-mono font-bold text-purple-300 truncate">{log.timezone || 'Asia/Kolkata'}</p>
          </div>

          {/* 6. Device Type */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-blue-400" /> 6. Device Type
            </span>
            <p className="text-sm font-bold text-white truncate">{log.device_type || 'Desktop'}</p>
          </div>

          {/* 7. Operating System */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> 7. Operating System
            </span>
            <p className="text-sm font-bold text-white truncate">{log.os || 'macOS'}</p>
          </div>

          {/* 8. Browser */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> 8. Browser
            </span>
            <p className="text-sm font-bold text-white truncate">{log.browser || 'Chrome'}</p>
          </div>

          {/* 9. Browser Version */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-violet-400" /> 9. Browser Version
            </span>
            <p className="text-sm font-mono font-bold text-white truncate">{log.browser_version || '120.0'}</p>
          </div>

          {/* 10. Screen Resolution */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MonitorSmartphone className="w-3.5 h-3.5 text-pink-400" /> 10. Screen Resolution
            </span>
            <p className="text-sm font-mono font-bold text-white truncate">{log.screen_resolution || '1920x1080'}</p>
          </div>

          {/* 11. Browser Language */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" /> 11. Browser Language
            </span>
            <p className="text-sm font-mono font-bold text-emerald-400 truncate">{log.language || 'en-US'}</p>
          </div>

          {/* 12. Referrer URL */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-sky-400" /> 12. Referrer URL
            </span>
            <p className="text-sm font-mono text-sky-300 truncate" title={log.referrer_url || 'Direct / None'}>
              {log.referrer_url || 'Direct / None'}
            </p>
          </div>

          {/* 13. Landing Page */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" /> 13. Landing Page
            </span>
            <p className="text-sm font-mono font-bold text-amber-300 truncate">{log.landing_page || '/'}</p>
          </div>

          {/* 14. Current Page */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-400" /> 14. Current Page
            </span>
            <p className="text-sm font-mono font-bold text-blue-300 truncate">{log.page_url}</p>
          </div>

          {/* 15. UTM Parameters */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-rose-400" /> 15. UTM Parameters
            </span>
            <p className="text-sm font-mono text-slate-300 truncate">{log.utm_params || 'None'}</p>
          </div>

          {/* 16. Visit Date / Time */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> 16. Visit Date / Time
            </span>
            <p className="text-sm font-mono font-bold text-white truncate">{formatDate(log.created_at)}</p>
          </div>

          {/* 17. Session ID */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-purple-400" /> 17. Session ID
            </span>
            <p className="text-xs font-mono text-purple-300 truncate" title={log.session_id}>
              {log.session_id || 'N/A'}
            </p>
          </div>

          {/* 18. Visitor Status */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" /> 18. Visitor Status
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                  isNew ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                {log.visitor_status || 'New Visitor'}
              </span>
              {log.user && (
                <span className="text-[11px] font-bold text-white truncate" title={log.user.name}>
                  ({log.user.name})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Raw User Agent Header Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            RAW USER AGENT HEADER
          </span>
          <p className="text-xs font-mono text-slate-300 break-all leading-relaxed">
            {log.user_agent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
          </p>
        </div>
      </div>
    </div>
  );
}
