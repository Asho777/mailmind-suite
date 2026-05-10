"use client";

import React, { useState, useEffect } from "react";
import { X, Save, User, Mail, Phone, MapPin, Building, Star } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  relationship: string;
  priority: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialContact?: Contact | null;
}

export default function ContactModal({ isOpen, onClose, onSave, initialContact }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    relationship: "Lead",
    priority: "Normal"
  });

  useEffect(() => {
    if (initialContact) {
      setFormData({
        name: initialContact.name,
        email: initialContact.email,
        phone: initialContact.phone || "",
        address: initialContact.address || "",
        company: initialContact.company,
        relationship: initialContact.relationship,
        priority: initialContact.priority
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        company: "",
        relationship: "Lead",
        priority: "Normal"
      });
    }
  }, [initialContact, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email are required.");
      return;
    }
    onSave({
      id: initialContact?.id || Math.random().toString(36).substr(2, 9),
      ...formData
    } as Contact);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{initialContact ? "Edit Contact" : "Add New Contact"}</h3>
              <p className="text-sm text-slate-500">Fill in the details below to save the contact.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Greg Ashley"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="greg@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+61 400 000 000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Company</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="NAVCO Australia"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Relationship</label>
            <select 
              value={formData.relationship}
              onChange={(e) => setFormData({...formData, relationship: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors appearance-none"
            >
              <option value="Key Client">Key Client</option>
              <option value="Lead">Lead</option>
              <option value="Vendor">Vendor</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
              <textarea 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Business Way, Sydney NSW"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-none h-24"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
          <button 
            onClick={() => setFormData({...formData, priority: formData.priority === "High" ? "Normal" : "High"})}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs ${
              formData.priority === "High" 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Star className={`w-4 h-4 ${formData.priority === "High" && "fill-current"}`} />
            Mark as Priority
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              {initialContact ? "Update" : "Save Contact"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
