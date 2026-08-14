import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Heart, Menu, X, LogOut, LayoutDashboard, Shield, ChevronDown, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Buy', href: '/properties?purpose=buy' },
    { name: 'Rent', href: '/properties?purpose=rent' },
    { name: 'Properties', href: '/properties' },
    { name: 'Agents', href: '/agents' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isLinkActive = (link: { name: string; href: string }) => {
    const currentPath = location.pathname;
    const currentPurpose = searchParams.get('purpose');

    if (link.name === 'Buy') {
      return currentPath === '/properties' && currentPurpose === 'buy';
    }
    if (link.name === 'Rent') {
      return currentPath === '/properties' && currentPurpose === 'rent';
    }
    if (link.name === 'Properties') {
      return currentPath === '/properties' && !currentPurpose;
    }
    if (link.href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(link.href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
              DVS<span className="text-amber-400">REALTY</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-slate-400 font-mono font-medium -mt-1">
              Luxury Living
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md relative shadow-inner">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors z-10 ${
                  active
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-amber-400 rounded-full shadow-md shadow-amber-400/20 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Wishlist Link */}
          <Link
            to="/dashboard?tab=favorites"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400/50 transition-all relative"
            title="Saved Favorites"
          >
            <Heart className="w-4 h-4 text-amber-400" />
          </Link>

          {/* User Account Controls */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-white max-w-[100px] truncate hidden sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-amber-400 uppercase font-mono font-bold mt-0.5">{user.role}</p>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-slate-800/60"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Control Suite
                    </Link>
                  )}

                  <Link
                    to="/dashboard?tab=profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    Edit Profile & Info
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    My Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 py-5 space-y-3 mt-2 shadow-2xl animate-in slide-in-from-top">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-amber-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!user ? (
            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-bold text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-center text-xs font-bold text-slate-950 shadow-lg shadow-amber-400/20"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="px-3 py-1 text-xs">
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-amber-400 font-mono font-bold uppercase">{user.role}</p>
              </div>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center"
                >
                  Admin Suite
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold text-center"
              >
                My Dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
