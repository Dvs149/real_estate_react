'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Building2 className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  DVS<span className="text-amber-400">REALTY</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-mono">
                  Luxury Real Estate
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier marketplace for ultra-luxury penthouses, private beach villas, signature architectural residences, and prime commercial real estate.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210 / +91 79 4000 8888</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@dvsrealty.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/properties" className="hover:text-amber-400 transition-colors">All Properties</Link></li>
              <li><Link href="/buy" className="hover:text-amber-400 transition-colors">Properties for Sale</Link></li>
              <li><Link href="/rent" className="hover:text-amber-400 transition-colors">Properties for Rent</Link></li>
              <li><Link href="/agents" className="hover:text-amber-400 transition-colors">Featured Agents</Link></li>
              <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Market Insights</Link></li>
            </ul>
          </div>

          {/* Top Locations */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base tracking-wide">Prime Cities</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/properties?city=ahmedabad" className="hover:text-amber-400 transition-colors">Ahmedabad Luxury Homes</Link></li>
              <li><Link href="/properties?city=mumbai" className="hover:text-amber-400 transition-colors">Mumbai Sea-View Flats</Link></li>
              <li><Link href="/properties?city=goa" className="hover:text-amber-400 transition-colors">Goa Beach Villas</Link></li>
              <li><Link href="/properties?city=bangalore" className="hover:text-amber-400 transition-colors">Bangalore Eco Villas</Link></li>
              <li><Link href="/properties?city=gurgaon" className="hover:text-amber-400 transition-colors">Gurgaon Penthouses</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base tracking-wide">VIP Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to receive exclusive off-market listings and luxury market reports.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DVS REALTY INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
