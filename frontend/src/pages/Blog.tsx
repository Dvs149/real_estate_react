import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, getBlogCategories } from '../services/api';
import { Blog as BlogType, BlogCategory } from '../types';
import { Loader2, ArrowRight, Search } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    Promise.all([
      getBlogs({ per_page: 100 }).then((res) => setBlogs(res.data || [])).catch(() => {}),
      getBlogCategories().then((res) => setCategories(res.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCat && b.blog_category_id !== Number(selectedCat) && b.category?.slug !== selectedCat) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        (b.category?.name && b.category.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCatChange = (catSlugOrId: string) => {
    setSelectedCat(catSlugOrId);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Real Estate Insights</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Market Analysis & Buyer Guides</h1>
        <p className="text-sm text-slate-400">
          Stay informed with expert intelligence on luxury property appreciation, legal updates, and architectural design trends.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="Search articles, topics, guides..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-lg"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-5" />
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => handleCatChange('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCat === ''
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            All Articles
          </button>
          {categories.map((c) => {
            const isActive = selectedCat === String(c.id) || selectedCat === c.slug;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCatChange(String(c.id))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-sm">Loading articles...</p>
        </div>
      ) : paginatedBlogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((b) => (
              <Link
                key={b.id}
                to={`/blog/${b.slug}`}
                className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-amber-400/40 transition-all flex flex-col h-full"
              >
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

          {/* Smart Truncated Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <div className="py-16 text-center bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-3">
          <p className="text-lg font-semibold text-white">No articles found matching your filter.</p>
          <button
            onClick={() => {
              setSelectedCat('');
              setSearch('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
