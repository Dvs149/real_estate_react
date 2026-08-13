import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getAdminStats,
  getProperties,
  updateEnquiryStatus,
  togglePropertyPublish,
  togglePropertyFeatured,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  updateUserRole,
  deleteAdminUser,
  deleteProperty,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../services/api';
import { Property, User, Enquiry, Appointment, Location } from '../types';
import {
  Shield,
  Building2,
  Users,
  FileText,
  CalendarCheck,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  MapPin,
  Plus,
  Edit2,
  X,
  LayoutDashboard,
  UserPlus,
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'locations' | 'leads' | 'users'>('overview');
  const [loading, setLoading] = useState<boolean>(true);

  // Location Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [locationForm, setLocationForm] = useState({
    name: '',
    city: '',
    state: '',
    country: 'India',
    image: '',
    is_popular: false,
  });
  const [savingLocation, setSavingLocation] = useState(false);

  // User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
  });
  const [savingUser, setSavingUser] = useState(false);
  const [userModalError, setUserModalError] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/login');
        return;
      }
      loadAdminData();
    }
  }, [user, authLoading, navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes, locationsRes, usersRes] = await Promise.all([
        getAdminStats().catch(() => ({ stats: {}, recent_enquiries: [], recent_appointments: [] })),
        getProperties({ per_page: 50 }).catch(() => ({ data: [] })),
        getLocations().catch(() => ({ data: [] })),
        getAdminUsers().catch(() => ({ data: [] })),
      ]);

      setStats(statsRes.stats);
      setEnquiries(statsRes.recent_enquiries || []);
      setAppointments(statsRes.recent_appointments || []);
      setProperties(propsRes.data || []);
      setLocationsList(locationsRes.data || []);
      setUsersList(usersRes.data || []);
    } catch (err) {
      console.error('Error loading admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await togglePropertyPublish(id);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: res.is_published } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await togglePropertyFeatured(id);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: res.is_featured } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnquiryStatusChange = async (id: number, status: string) => {
    try {
      await updateEnquiryStatus(id, status);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: status as any } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      const res = await updateUserRole(id, role);
      setUsersList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: res.user.role } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // User Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
    });
    setShowUserPassword(false);
    setUserModalError('');
    setShowUserModal(true);
  };

  const handleOpenEditUser = (targetUser: User) => {
    setEditingUser(targetUser);
    setUserForm({
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone || '',
      role: targetUser.role,
      password: '',
    });
    setShowUserPassword(false);
    setUserModalError('');
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUser(true);
    setUserModalError('');
    try {
      if (editingUser) {
        const res = await updateAdminUser(editingUser.id, userForm);
        setUsersList((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...res.data } : u))
        );
      } else {
        const res = await createAdminUser(userForm);
        setUsersList((prev) => [res.data, ...prev]);
      }
      setShowUserModal(false);
    } catch (err: any) {
      setUserModalError(err.message || 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteAdminUser(id);
      setUsersList((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Location Handlers
  const handleOpenAddLocation = () => {
    setEditingLocation(null);
    setLocationForm({
      name: '',
      city: '',
      state: '',
      country: 'India',
      image: '',
      is_popular: false,
    });
    setShowLocationModal(true);
  };

  const handleOpenEditLocation = (loc: Location) => {
    setEditingLocation(loc);
    setLocationForm({
      name: loc.name,
      city: loc.city,
      state: loc.state || '',
      country: loc.country || 'India',
      image: loc.image || '',
      is_popular: !!loc.is_popular,
    });
    setShowLocationModal(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLocation(true);
    try {
      if (editingLocation) {
        const res = await updateLocation(editingLocation.id, locationForm);
        setLocationsList((prev) =>
          prev.map((l) => (l.id === editingLocation.id ? { ...l, ...res.data } : l))
        );
      } else {
        const res = await createLocation(locationForm);
        setLocationsList((prev) => [...prev, res.data]);
      }
      setShowLocationModal(false);
    } catch (err) {
      console.error('Error saving location:', err);
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      await deleteLocation(id);
      setLocationsList((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Error deleting location:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-medium">Initializing Admin Console...</p>
      </div>
    );
  }

  const navMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'properties', label: 'Properties Catalog', icon: Building2, badge: properties.length },
    { id: 'locations', label: 'Metro Locations', icon: MapPin, badge: locationsList.length },
    { id: 'leads', label: 'Customer Leads', icon: FileText, badge: enquiries.length },
    { id: 'users', label: 'Users & Roles', icon: Users, badge: usersList.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu Navigation */}
        <aside className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-6 shadow-2xl backdrop-blur-xl lg:sticky lg:top-24">
          {/* Header Badge */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Admin Suite</h2>
              <p className="text-[11px] text-slate-400 font-medium">Management & Operations</p>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1.5">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 translate-x-1'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        active ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Info Box */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2.5">
            <div className="flex items-center justify-between">
              <span>Database Engine</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> MySQL Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Current User</span>
              <span className="text-amber-400 font-semibold truncate max-w-[120px]">{user?.name}</span>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="lg:col-span-9 space-y-8">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl space-y-2 relative overflow-hidden shadow-xl">
                <div className="absolute -right-6 -bottom-6 text-emerald-500/5 pointer-events-none">
                  <Shield className="w-48 h-48" />
                </div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">System Overview</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome, {user?.name}</h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
                  Real-time operational summary across property approvals, metro location management, customer leads, and visit appointments.
                </p>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Properties</span>
                    <Building2 className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{stats?.total_properties || 0}</p>
                  <p className="text-[11px] text-emerald-400 font-medium">Active catalog listings</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{stats?.total_users || 0}</p>
                  <p className="text-[11px] text-slate-400">Including agents & admins</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Customer Leads</span>
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{stats?.total_enquiries || 0}</p>
                  <p className="text-[11px] text-blue-400 font-medium">Inquiries received</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Visits</span>
                    <CalendarCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-3xl font-extrabold text-white">{stats?.total_appointments || 0}</p>
                  <p className="text-[11px] text-purple-400 font-medium">Private walkthroughs</p>
                </div>
              </div>

              {/* Recent Inquiries & Appointments Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Recent Property Inquiries
                  </h3>
                  <div className="space-y-3">
                    {enquiries.slice(0, 5).map((enq) => (
                      <div key={enq.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{enq.name}</p>
                          <p className="text-slate-400 text-[11px]">{enq.email} • {enq.phone}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md uppercase font-bold text-[10px] ${
                          enq.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-purple-400" />
                    Pending Tour Appointments
                  </h3>
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{apt.name}</p>
                          <p className="text-purple-300 text-[11px]">Requested: {apt.date} ({apt.time_slot})</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 uppercase font-bold text-[10px]">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROPERTIES TAB */}
          {activeTab === 'properties' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    Manage Listings Catalog
                  </h2>
                  <p className="text-xs text-slate-400">Review status, toggle publishing, promote featured listings, or remove properties.</p>
                </div>
              </div>
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Property</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-center">Published</th>
                    <th className="p-3 text-center">Featured</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white max-w-[240px] truncate">{prop.title}</td>
                      <td className="p-3 text-slate-400">{prop.property_type?.name}</td>
                      <td className="p-3 text-slate-400">{prop.location?.city}</td>
                      <td className="p-3 font-bold text-amber-400">{prop.formatted_price}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleTogglePublish(prop.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            prop.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {prop.is_published ? 'YES' : 'NO'}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleFeatured(prop.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            prop.is_featured ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {prop.is_featured ? 'FEATURED' : 'NO'}
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => window.open(`/properties/${prop.slug}`, '_blank')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* LOCATIONS TAB */}
          {activeTab === 'locations' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    Dynamic Location Management
                  </h2>
                  <p className="text-xs text-slate-400">Add, edit, or remove cities & metro locations for property filtering.</p>
                </div>
                <button
                  onClick={handleOpenAddLocation}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Location
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Location Name</th>
                      <th className="p-3">City</th>
                      <th className="p-3">State</th>
                      <th className="p-3">Properties</th>
                      <th className="p-3 text-center">Popular</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {locationsList.map((loc) => (
                      <tr key={loc.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white flex items-center gap-2.5">
                          {loc.image && (
                            <img src={loc.image} alt={loc.name} className="w-7 h-7 rounded-lg object-cover" />
                          )}
                          {loc.name}
                        </td>
                        <td className="p-3 text-amber-300 font-medium">{loc.city}</td>
                        <td className="p-3 text-slate-400">{loc.state || '—'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {loc.properties_count ?? 0} listings
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            loc.is_popular ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {loc.is_popular ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditLocation(loc)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                            title="Edit Location"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLocation(loc.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 cursor-pointer"
                            title="Delete Location"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl overflow-x-auto">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                Customer Leads & Inquiries
              </h2>
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Property</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{enq.name}</td>
                      <td className="p-3 text-slate-400">
                        <p>{enq.email}</p>
                        <p className="text-[10px] text-slate-500">{enq.phone}</p>
                      </td>
                      <td className="p-3 text-amber-400">{enq.property?.title || 'General Enquiry'}</td>
                      <td className="p-3 text-slate-400 max-w-[200px] truncate">{enq.message}</td>
                      <td className="p-3">
                        <select
                          value={enq.status}
                          onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2.5 py-1 cursor-pointer"
                        >
                          <option value="new">New Lead</option>
                          <option value="contact_in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    User & Role Management Page
                  </h2>
                  <p className="text-xs text-slate-400">Create new user accounts, edit details, assign roles (Admin, Agent, Buyer), or remove accounts.</p>
                </div>
                <button
                  onClick={handleOpenAddUser}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  Add New User
                </button>
              </div>

              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Current Role</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                          className="w-6 h-6 rounded-full object-cover"
                          alt={u.name}
                        />
                        {u.name}
                      </td>
                      <td className="p-3 text-slate-400">{u.email}</td>
                      <td className="p-3 text-slate-400">{u.phone || '—'}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs rounded-lg px-2.5 py-1 uppercase cursor-pointer"
                        >
                          <option value="user">USER</option>
                          <option value="agent">AGENT</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          title="Edit User Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                {editingUser ? 'Edit User Account' : 'Add New User Account'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userModalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {userModalError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mehta"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 12345"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Role *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="user">USER (Buyer / Renter)</option>
                    <option value="agent">AGENT (Real Estate Agent)</option>
                    <option value="admin">ADMIN (System Administrator)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {editingUser ? 'New Password (Optional)' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPassword ? 'text' : 'password'}
                      required={!editingUser}
                      placeholder={editingUser ? 'Leave blank to keep current' : '••••••••'}
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                      title={showUserPassword ? 'Hide password' : 'Show password'}
                    >
                      {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1.5 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  {savingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingUser ? 'Update User Account' : 'Create User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOCATION ADD / EDIT MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Location Area Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bodakdev or Bandra West"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmedabad"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat"
                    value={locationForm.state}
                    onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Header Image URL (Unsplash or CDN)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={locationForm.image}
                  onChange={(e) => setLocationForm({ ...locationForm, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={locationForm.is_popular}
                  onChange={(e) => setLocationForm({ ...locationForm, is_popular: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="is_popular" className="text-xs text-slate-300 cursor-pointer">
                  Feature in Popular Metro Destination Cards on Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLocation}
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 flex items-center gap-1.5 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  {savingLocation && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingLocation ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
