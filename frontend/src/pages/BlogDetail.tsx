import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogBySlug } from '../services/api';
import { Blog } from '../types';
import { ChevronLeft, Loader2, Calendar, User as UserIcon } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (slug) {
      getBlogBySlug(slug)
        .then((res) => setBlog(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return <div className="py-20 text-center text-slate-400">Article not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Articles
      </button>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
          {blog.category?.name}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{blog.title}</h1>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-amber-400" />
            <span>{blog.author_name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Recent'}</span>
          </div>
        </div>
      </div>

      <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line">
        {blog.content}
      </div>
    </div>
  );
}
