'use client';

import React, { useState } from 'react';
import { Agent, Property } from '../types';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { submitEnquiry } from '../services/api';

interface ContactAgentModalProps {
  agent: Agent;
  property?: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactAgentModal({ agent, property, isOpen, onClose }: ContactAgentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    property ? `Hi ${agent.name}, I am interested in "${property.title}". Please send more details.` : `Hi ${agent.name}, I would like to inquire about your property advisory services.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitEnquiry({
        agent_id: agent.id,
        property_id: property?.id,
        name,
        email,
        phone,
        message,
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to submit enquiry');
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Message Transmitted!</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Thank you {name}. Senior agent {agent.name} will reach out to you at {phone} within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <img
                src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'}
                alt={agent.name}
                className="w-12 h-12 rounded-full object-cover border border-amber-400/40"
              />
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Inquire with {agent.name}</h3>
                <p className="text-xs text-slate-400">{agent.agency_name}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Divyesh Lunagariya"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="divyesh@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Transmitting...' : 'Send Direct Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
