'use client';

import React, { useState } from 'react';
import { PropertyImage } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] rounded-3xl bg-slate-900 flex items-center justify-center text-slate-500">
        No Images Available
      </div>
    );
  }

  const currentImage = images[selectedIndex]?.image_path || images[0].image_path;

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl group">
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Fullscreen Icon */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-3 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-lg"
          title="Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === index ? 'border-amber-400 opacity-100 scale-105 shadow-md shadow-amber-400/20' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.image_path} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 text-white hover:text-amber-400 border border-slate-800"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={currentImage}
            alt={title}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/80 text-white hover:text-amber-400 border border-slate-800"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-slate-900/80 text-white hover:text-amber-400 border border-slate-800"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
