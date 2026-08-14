import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, getUserEnquiries, getUserAppointments, updateAppointmentStatus } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomSelect from '../components/CustomSelect';
import { Property, Enquiry, Appointment } from '../types';
import { User, Heart, MessageSquare, Calendar, Shield, Save, Loader2, Clock, MapPin, Mail, Phone, Edit2, CheckCircle2, Lock, Key, Camera, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'profile');
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Reschedule & Edit Appointment State
  const [editingAppId, setEditingAppId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editTime, setEditTime] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [savingApp, setSavingApp] = useState<boolean>(false);

  const handleStartEditApp = (app: Appointment) => {
    setEditingAppId(app.id);
    setEditDate(app.date ? app.date.split('T')[0] : '');
    setEditTime(app.time_slot || '11:00 AM');
    setEditStatus(app.status || 'pending');
  };

  const handleSaveAppReschedule = async (id: number) => {
    setSavingApp(true);
    try {
      const res = await updateAppointmentStatus(id, editStatus, {
        date: editDate,
        time_slot: editTime,
      });
      const updatedData = res.data || {};
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, ...updatedData, status: editStatus as any, date: editDate, time_slot: editTime }
            : app
        )
      );
      setEditingAppId(null);
    } catch (err) {
      console.error('Failed to reschedule appointment:', err);
    } finally {
      setSavingApp(false);
    }
  };

  // Profile & Security form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
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
    setProfileFeedback(null);

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setProfileFeedback({ type: 'error', message: 'Current password is required to change your password.' });
        setSavingProfile(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setProfileFeedback({ type: 'error', message: 'New password and confirm password do not match.' });
        setSavingProfile(false);
        return;
      }
      if (newPassword.length < 6) {
        setProfileFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
        setSavingProfile(false);
        return;
      }
    }

    try {
      const payload: Record<string, any> = {
        name,
        email,
        phone,
        avatar,
      };

      if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.password = newPassword;
      }

      await updateProfile(payload);
      setProfileFeedback({ type: 'success', message: 'Profile & account information updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setProfileFeedback({ type: 'error', message: err.message || 'Failed to update profile' });
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
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20 overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {user.name}
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-extrabold">
                  {user.role}
                </span>
              </h2>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          {profileFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {profileFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{profileFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-8">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Profile Avatar URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Password & Security */}
            <div className="space-y-4 border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Change Password (Optional)
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to authorize change"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="py-3 px-6 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                {savingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Account Updates
              </button>
            </div>
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
            <div className="space-y-3">
              {enquiries.map((enq) => {
                const prop = enq.property;
                const propImage =
                  prop?.primary_image ||
                  (prop?.images && prop.images.length > 0
                    ? prop.images[0].image_path
                    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400');

                return (
                  <div key={enq.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3 shadow-lg">
                    {/* Top Row: Thumbnail + Info + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {propImage && (
                          <img
                            src={propImage}
                            alt={prop?.title || 'Property'}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                        )}
                        <div className="min-w-0 space-y-0.5">
                          {prop ? (
                            <Link
                              to={`/properties/${prop.slug}`}
                              className="font-bold text-white hover:text-amber-400 transition-colors text-sm sm:text-base block truncate"
                            >
                              {prop.title}
                            </Link>
                          ) : (
                            <h4 className="font-bold text-white text-sm sm:text-base truncate">General Property Inquiry</h4>
                          )}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-amber-400 font-mono font-bold">
                              {prop?.formatted_price || (prop?.price ? `₹ ${prop.price}` : '')}
                            </span>
                            {prop?.location && (
                              <span className="text-slate-400 text-[11px] flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                {prop.location.city}, {prop.location.state}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shrink-0 ${
                          enq.status === 'new'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : enq.status === 'contact_in_progress'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {enq.status === 'contact_in_progress' ? 'IN PROGRESS' : enq.status}
                      </span>
                    </div>

                    {/* Meta info in 1 compact bar */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-amber-300/90 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          {enq.created_at ? formatDate(enq.created_at) : 'Recent Inquiry'}
                        </span>
                        <span>•</span>
                        <span className="text-slate-300 font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          {enq.name}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          {enq.email}
                        </span>
                        {enq.phone && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3 shrink-0" />
                              {enq.phone}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Compact Message Box */}
                    {enq.message && (
                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/60 text-xs">
                        <p className="text-slate-300 italic text-[11px]">"{enq.message}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
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
            <div className="space-y-3">
              {appointments.map((app) => {
                const prop = app.property;
                const propImage =
                  prop?.primary_image ||
                  (prop?.images && prop.images.length > 0
                    ? prop.images[0].image_path
                    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400');

                return (
                  <div key={app.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-3 shadow-lg">
                    {/* Top Row: Thumbnail + Info + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {propImage && (
                          <img
                            src={propImage}
                            alt={prop?.title || 'Property'}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                        )}
                        <div className="min-w-0 space-y-0.5">
                          {prop ? (
                            <Link
                              to={`/properties/${prop.slug}`}
                              className="font-bold text-white hover:text-amber-400 transition-colors text-sm sm:text-base block truncate"
                            >
                              {prop.title}
                            </Link>
                          ) : (
                            <h4 className="font-bold text-white text-sm sm:text-base truncate">Property Walkthrough</h4>
                          )}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-amber-400 font-mono font-bold">
                              {prop?.formatted_price || (prop?.price ? `₹ ${prop.price}` : '')}
                            </span>
                            {prop?.location && (
                              <span className="text-slate-400 text-[11px] flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                {prop.location.city}, {prop.location.state}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            app.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : app.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : app.status === 'cancelled'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          }`}
                        >
                          {app.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => (editingAppId === app.id ? setEditingAppId(null) : handleStartEditApp(app))}
                          className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-slate-950 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" /> Reschedule
                        </button>
                      </div>
                    </div>

                    {/* Meta info in 1 compact bar */}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          {formatDate(app.date)}
                        </span>
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          {app.time_slot}
                        </span>
                        <span>•</span>
                        <span className="text-slate-300 font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          {app.name}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          {app.email}
                        </span>
                        {app.phone && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3 shrink-0" />
                              {app.phone}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Special Requests / Notes */}
                    {app.notes && (
                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/60 text-xs">
                        <p className="text-slate-300 italic text-[11px]">"{app.notes}"</p>
                      </div>
                    )}

                    {/* Expandable Reschedule Controls */}
                    {editingAppId === app.id && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-400/30 space-y-3 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Reschedule Date</span>
                            <CustomDatePicker
                              value={editDate}
                              onChange={(newDate) => setEditDate(newDate)}
                              minDate={new Date().toISOString().split('T')[0]}
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Slot</span>
                            <CustomSelect
                              value={editTime}
                              onChange={(newTime) => setEditTime(newTime)}
                              options={[
                                { value: '09:00 AM', label: '09:00 AM' },
                                { value: '10:00 AM', label: '10:00 AM' },
                                { value: '11:00 AM', label: '11:00 AM' },
                                { value: '12:00 PM', label: '12:00 PM' },
                                { value: '02:00 PM', label: '02:00 PM' },
                                { value: '04:00 PM', label: '04:00 PM' },
                                { value: '06:00 PM', label: '06:00 PM' },
                              ]}
                              variant="compact"
                              direction="up"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                            <CustomSelect
                              value={editStatus}
                              onChange={(newStatus) => setEditStatus(newStatus)}
                              options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                              ]}
                              variant="compact"
                              direction="up"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                          <button
                            type="button"
                            onClick={() => setEditingAppId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={savingApp}
                            onClick={() => handleSaveAppReschedule(app.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                          >
                            {savingApp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
