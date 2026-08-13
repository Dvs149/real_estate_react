'use client';

import React, { useState } from 'react';
import { Property } from '../types';
import { X, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { submitAppointment } from '../services/api';

interface ScheduleVisitModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleVisitModal({ property, isOpen, onClose }: ScheduleVisitModalProps) {
  const [date, setDate] = useState(nowDateString());
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  function nowDateString() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }

  const timeSlots = ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAppointment({
        property_id: property.id,
        name,
        email,
        phone,
        date,
        time_slot: timeSlot,
        notes,
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to book visit appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Private Tour Scheduled!</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Your appointment for <span className="text-amber-400 font-semibold">{property.title}</span> on {date} at {timeSlot} is confirmed.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white leading-tight">Schedule Private Viewing</h3>
              <p className="text-xs text-amber-400 line-clamp-1 mt-0.5">{property.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Divyesh Lunagariya"
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="divyesh@example.com"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 90123 45678"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Special Requests / Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Prefer VIP chauffeur pick up from hotel"
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/20"
            >
              {submitting ? 'Confirming Tour...' : 'Confirm Private Tour Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
