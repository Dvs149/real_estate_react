import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, getUserEnquiries, getUserAppointments } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { Property, Enquiry, Appointment } from '../types';
import { User, Heart, MessageSquare, Calendar, Shield, Save, Loader2, Clock } from 'lucide-react';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profile');
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      loadTabData();
    }
  }, [user, activeTab]);

  const loadTabData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'favorites') {
        const res = await getFavorites();
        setFavorites(res.data || []);
      } else if (activeTab === 'enquiries') {
        const res = await getUserEnquiries();
        setEnquiries(res.data || []);
      } else if (activeTab === 'appointments') {
        const res = await getUserAppointments();
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await updateProfile({ name, phone });
      setProfileMsg('Profile updated successfully!');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm">Loading User Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50 shadow-lg shrink-0"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
            <p className="text-xs text-slate-400">{user.email} • Role: <span className="text-amber-400 uppercase font-semibold">{user.role}</span></p>
          </div>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="px-5 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" /> Open Admin Control Panel
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" /> Profile Settings
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'favorites' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Properties
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'enquiries' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> My Enquiries
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'appointments' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" /> Visit Appointments
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'profile' && (
        <div className="max-w-xl p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white">Account Information</h2>
          {profileMsg && <p className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">{profileMsg}</p>}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address (Read only)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 90123 45678"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="py-3 px-6 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Profile Updates
            </button>
          </form>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Your Saved Favorites</h2>
          {loadingData ? (
            <div className="py-12 text-center text-slate-400">Loading saved properties...</div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onFavoriteToggle={(id, isFav) => {
                    if (!isFav) setFavorites((prev) => prev.filter((item) => item.id !== id));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
              You haven't saved any property listings yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Your Submitted Enquiries</h2>
          {loadingData ? (
            <div className="py-12 text-center text-slate-400">Loading enquiries...</div>
          ) : enquiries.length > 0 ? (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base">{enq.property?.title || 'General Enquiry'}</h4>
                      <p className="text-xs text-slate-400">Sent on: {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : ''}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300">
                      Status: {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-xl border border-slate-800">"{enq.message}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
              No enquiries submitted yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Scheduled Visit Appointments</h2>
          {loadingData ? (
            <div className="py-12 text-center text-slate-400">Loading visit requests...</div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base">{app.property?.title}</h4>
                      <p className="text-xs text-amber-400 font-semibold flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5" /> Scheduled Date: {app.date} at {app.time_slot}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-400/20 text-amber-300'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  {app.notes && <p className="text-xs text-slate-400">Notes: {app.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
              No visit appointments scheduled yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
