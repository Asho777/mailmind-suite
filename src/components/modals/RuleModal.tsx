"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Zap, ArrowRight } from "lucide-react";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Rule) => void;
  initialRule?: Rule | null;
}

export default function RuleModal({ isOpen, onClose, onSave, initialRule }: RuleModalProps) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    if (initialRule) {
      setName(initialRule.name);
      setTrigger(initialRule.trigger);
      setAction(initialRule.action);
    } else {
      setName("");
      setTrigger("");
      setAction("");
    }
  }, [initialRule, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !trigger || !action) {
      alert("Please fill in all fields.");
      return;
    }
    onSave({
      id: initialRule?.id || Math.random().toString(36).substr(2, 9),
      name,
      trigger,
      action,
      isActive: initialRule ? initialRule.isActive : true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100">{initialRule ? "Edit Rule" : "Create New Rule"}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rule Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Auto-Archive Spam"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="text-indigo-400">IF</span> Trigger Condition
              </label>
              <input 
                type="text" 
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="e.g. Sender contains 'marketing'"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-slate-700 rotate-90" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="text-emerald-400">THEN</span> Action
              </label>
              <input 
                type="text" 
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="e.g. Mark as read and Archive"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {initialRule ? "Update Rule" : "Create Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
