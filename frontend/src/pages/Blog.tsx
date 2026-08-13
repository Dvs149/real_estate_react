import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../services/api';
import { Blog as BlogType } from '../types';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getBlogs()
      .then((res) => setBlogs(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Real Estate Insights</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Market Analysis & Buyer Guides</h1>
        <p className="text-sm text-slate-400">
          Stay informed with expert intelligence on luxury property appreciation, legal updates, and architectural design trends.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm">Loading articles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <Link key={b.id} to={`/blog/${b.slug}`} className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-amber-400/40 transition-all flex flex-col h-full">
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src={b.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{b.category?.name}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{b.excerpt}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-500">
                  <span>By {b.author_name}</span>
                  <span className="font-semibold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
