import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function CustomDatePicker({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  placeholder = 'Select Date',
  className = '',
  icon,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date or fallback to today
  const parsedDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const isValidSelected = value && !isNaN(parsedDate.getTime());

  // View state for navigating calendar month/year
  const [viewDate, setViewDate] = useState(() => {
    return isValidSelected ? new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1) : new Date();
  });

  // Keep viewDate in sync when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(`${value}T00:00:00`);
      if (!isNaN(d.getTime())) {
        setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
  }, [value]);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate days grid for month view
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Format YYYY-MM-DD helper
  const formatYMD = (year: number, monthZeroIndex: number, day: number) => {
    const m = String(monthZeroIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const todayStr = (() => {
    const now = new Date();
    return formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
  })();

  const handleDaySelect = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  // Helper for human-formatted trigger display
  const displayFormatted = (() => {
    if (!value || !isValidSelected) return placeholder;
    return parsedDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  })();

  return (
    <div className={`relative min-w-0 w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
          {icon || <Calendar className="w-3.5 h-3.5 text-amber-400" />}
          {label}
        </label>
      )}

      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/90 border transition-all duration-200 text-xs font-medium cursor-pointer ${
          isOpen
            ? 'border-amber-400 ring-2 ring-amber-400/20 text-amber-300 shadow-lg shadow-amber-400/10'
            : 'border-slate-800 hover:border-slate-700 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <span className={isValidSelected ? 'text-white font-semibold' : 'text-slate-500'}>
            {displayFormatted}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>

      {/* Dark Theme Custom Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 z-[100] w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3"
          >
            {/* Header: Month & Year Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-extrabold text-white tracking-wide">
                {monthNames[currentMonth]} {currentYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {dayNames.map((d) => (
                <span key={d} className="text-[10px] font-bold uppercase text-amber-400/80 py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Previous month leading days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                const prevDay = daysInPrevMonth - firstDayOfMonth + i + 1;
                return (
                  <span
                    key={`prev-${i}`}
                    className="py-1.5 text-[11px] text-slate-700 select-none cursor-not-allowed"
                  >
                    {prevDay}
                  </span>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = formatYMD(currentYear, currentMonth, day);
                const isSelected = value === dateStr;
                const isToday = todayStr === dateStr;

                // Min/Max date check
                let isDisabled = false;
                if (minDate && dateStr < minDate) isDisabled = true;
                if (maxDate && dateStr > maxDate) isDisabled = true;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDaySelect(dateStr)}
                    className={`py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20 scale-105'
                        : isDisabled
                        ? 'text-slate-700 cursor-not-allowed opacity-40'
                        : isToday
                        ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950 font-bold'
                        : 'text-slate-200 hover:bg-slate-800 hover:text-amber-400'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick Action Preset Footer */}
            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const str = formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
                  if (!minDate || str >= minDate) handleDaySelect(str);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium cursor-pointer transition-colors"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => {
                  const tmw = new Date();
                  tmw.setDate(tmw.getDate() + 1);
                  const str = formatYMD(tmw.getFullYear(), tmw.getMonth(), tmw.getDate());
                  if (!minDate || str >= minDate) handleDaySelect(str);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium cursor-pointer transition-colors"
              >
                Tomorrow
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  const str = formatYMD(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate());
                  if (!minDate || str >= minDate) handleDaySelect(str);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium cursor-pointer transition-colors"
              >
                +7 Days
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
