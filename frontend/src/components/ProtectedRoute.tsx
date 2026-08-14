import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-medium">Verifying security authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-2xl">
          <ShieldAlert className="w-8 h-8 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Access Restricted</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your current account role (<span className="text-amber-400 uppercase font-bold">{user.role}</span>) does not have authorization to view this area.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-lg shadow-amber-400/20"
          >
            Go To My Dashboard
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-300 font-semibold text-xs border border-slate-800 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Home Page
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
