import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import { Clock, X, LogIn } from 'lucide-react';

// Lazy Loaded Pages for performance optimization & dynamic code-splitting
const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Agents = lazy(() => import('./pages/Agents'));
const AgentDetail = lazy(() => import('./pages/AgentDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));

import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import ScrollToTop from './components/ScrollToTop';
import VisitorTracker from './components/VisitorTracker';

function InactivityBanner() {
  const { inactivityLoggedOut, dismissInactivityNotice } = useAuth();

  if (!inactivityLoggedOut) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 border border-amber-400/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-5 h-5 stroke-[2.5]" />
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Session Expired</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            You were automatically signed out after 15 minutes of inactivity for your security.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              onClick={dismissInactivityNotice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-md shadow-amber-400/20"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign Back In
            </Link>
          </div>
        </div>

        <button
          onClick={dismissInactivityNotice}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <VisitorTracker />
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-amber-400 selection:text-slate-950">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:slug" element={<PropertyDetail />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/agents/:slug" element={<AgentDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
                <Route path="/admin/:tab" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>
          <InactivityBanner />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
