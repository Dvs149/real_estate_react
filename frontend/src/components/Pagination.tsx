import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5;

    // Case 1: totalPages is less than page numbers we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'DOTS', lastPageIndex];
    }

    // Case 3: No right dots to show, but left dots needed
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, 'DOTS', ...rightRange];
    }

    // Case 4: Both left and right dots to show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, 'DOTS_LEFT', ...middleRange, 'DOTS_RIGHT', lastPageIndex];
    }

    return [];
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 pt-8 select-none">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
          currentPage === 1
            ? 'opacity-40 cursor-not-allowed bg-slate-900/60 text-slate-500 border border-slate-800'
            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/50 hover:text-amber-400'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers & Ellipses */}
      {pages.map((page, idx) => {
        if (page === 'DOTS' || page === 'DOTS_LEFT' || page === 'DOTS_RIGHT') {
          return (
            <span
              key={`dots-${idx}`}
              className="w-8 sm:w-10 h-9 sm:h-10 flex items-center justify-center text-slate-500 font-bold text-xs tracking-widest"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-9 sm:w-10 h-9 sm:h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isActive
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-105'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
          currentPage === totalPages
            ? 'opacity-40 cursor-not-allowed bg-slate-900/60 text-slate-500 border border-slate-800'
            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/50 hover:text-amber-400'
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
