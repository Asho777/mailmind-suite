"use client";

import React, { useState, useEffect } from "react";
import { X, Save, FileText, Tag, Hash } from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  body: string;
  usage: number;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
  initialTemplate?: Template | null;
}

export default function TemplateModal({ isOpen, onClose, onSave, initialTemplate }: TemplateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    body: ""
  });

  useEffect(() => {
    if (initialTemplate) {
      setFormData({
        name: initialTemplate.name,
        category: initialTemplate.category,
        body: initialTemplate.body
      });
    } else {
      setFormData({
        name: "",
        category: "General",
        body: ""
      });
    }
  }, [initialTemplate, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !formData.body) {
      alert("Name and Body are required.");
      return;
    }
    onSave({
      id: initialTemplate?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      category: formData.category,
      body: formData.body,
      usage: initialTemplate?.usage || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{initialTemplate ? "Edit Template" : "Create New Template"}</h3>
              <p className="text-sm text-slate-500">Define reusable content with AI variables.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Template Name</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Sales Follow-up"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="Sales">Sales</option>
                  <option value="Billing">Billing</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="General">General</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message Body</label>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded uppercase">
                <Hash className="w-3 h-3" /> use &#123;&#123;variable&#125;&#125; for AI tags
              </div>
            </div>
            <textarea 
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              placeholder="Hi {{name}}, thank you for..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-slate-200 outline-none focus:border-indigo-500 transition-colors h-48 resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
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
            {initialTemplate ? "Save Changes" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}
