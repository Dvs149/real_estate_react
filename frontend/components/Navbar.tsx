'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Building2, Heart, User as UserIcon, Menu, X, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  const purpose = searchParams.get('purpose');

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
    if (link.name === 'Buy') {
      return pathname === '/buy' || (pathname === '/properties' && purpose === 'buy');
    }
    if (link.name === 'Rent') {
      return pathname === '/rent' || (pathname === '/properties' && purpose === 'rent');
    }
    if (link.name === 'Properties') {
      return pathname === '/properties' && !purpose;
    }
    return pathname === link.href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-3'
          : 'bg-gradient-to-b from-slate-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              DVS<span className="text-amber-400">REALTY</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-400 font-mono font-medium -mt-1">
              Luxury Living
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-md relative">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-10 ${
                  active
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
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

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard?tab=favorites"
            className="p-2.5 rounded-full bg-slate-800/60 text-slate-300 hover:text-amber-400 border border-slate-700/50 hover:border-amber-400/40 transition-colors relative"
            title="Saved Favorites"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-sm transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-xs max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 text-[10px] uppercase font-bold tracking-wider">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
                    >
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Admin Control Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 mt-1 border-t border-slate-800"
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
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-4 pb-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium ${
                    active ? 'bg-amber-400/20 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-white font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  Dashboard ({user.name})
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-400 font-medium text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-800 text-white font-medium text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-amber-400 text-slate-950 font-semibold text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 py-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-white font-bold">
          DVS REALTY
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
