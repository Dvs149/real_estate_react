import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CustomSelect from './CustomSelect';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (perPage: number) => void;
  totalItems?: number;
  itemsPerPageOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  itemsPerPageOptions = [5, 10, 20, 50, 100],
}: PaginationProps) {
  if (
    totalPages <= 1 &&
    (!itemsPerPage || !onItemsPerPageChange || (totalItems !== undefined && totalItems <= (itemsPerPageOptions[0] || 5)))
  ) {
    return null;
  }

  const generatePageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'DOTS', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, 'DOTS', ...rightRange];
    }

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

  const startItem = totalItems && totalItems > 0 && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 select-none border-t border-slate-800/60 mt-4">
      {/* Left Summary & Per-Page Controls */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
        {totalItems !== undefined && totalItems > 0 && (
          <span>
            Showing <strong className="text-white font-bold">{startItem}</strong>
            {' – '}
            <strong className="text-white font-bold">{endItem}</strong> of{' '}
            <strong className="text-amber-400 font-bold">{totalItems}</strong> entries
          </span>
        )}

        {itemsPerPage !== undefined && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Per page:</span>
            <CustomSelect
              value={String(itemsPerPage)}
              onChange={(val) => onItemsPerPageChange(Number(val))}
              options={itemsPerPageOptions.map((opt) => ({
                value: String(opt),
                label: `${opt} / page`,
              }))}
              variant="compact"
              direction="up"
              className="w-28"
            />
          </div>
        )}
      </div>

      {/* Right Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed bg-slate-900/60 text-slate-500 border border-slate-800'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/50 hover:text-amber-400'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {pages.map((page, idx) => {
            if (page === 'DOTS' || page === 'DOTS_LEFT' || page === 'DOTS_RIGHT') {
              return (
                <span
                  key={`dots-${idx}`}
                  className="w-7 sm:w-8 h-8 sm:h-9 flex items-center justify-center text-slate-500 font-bold text-xs tracking-widest"
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
                className={`w-8 sm:w-9 h-8 sm:h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-105'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed bg-slate-900/60 text-slate-500 border border-slate-800'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-400/50 hover:text-amber-400'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
