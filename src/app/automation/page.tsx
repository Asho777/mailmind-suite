"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Eye, 
  ShieldCheck, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import RuleModal from "@/components/modals/RuleModal";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

const automationModes = [
  {
    id: "watch",
    name: "Watch Mode",
    description: "AI analyses and labels everything, but never sends or archives without your action.",
    icon: Eye,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
  },
  {
    id: "review",
    name: "Review Mode",
    description: "AI drafts all replies. You review and approve before they are sent. Default.",
    icon: ShieldCheck,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-400/50",
    isDefault: true,
  },
  {
    id: "autopilot",
    name: "Full Autopilot",
    description: "AI reads, drafts, and sends replies automatically based on your rules and confidence.",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
  },
];

const DEFAULT_RULES: Rule[] = [
  {
    id: "1",
    name: "Security Alerts",
    trigger: "Subject contains 'Security Alert'",
    action: "Mark as Urgent & Notify",
    isActive: true,
  },
  {
    id: "2",
    name: "Client Invoices",
    trigger: "Sender is 'accounts@client.com'",
    action: "Auto-Draft Professional Reply",
    isActive: true,
  },
  {
    id: "3",
    name: "Generic Sales Outreach",
    trigger: "Priority < 3 & Intent is 'Sales'",
    action: "Auto-Archive",
    isActive: false,
  },
];

const STORAGE_KEY = "mailmind_automation_settings";

export default function AutomationPage() {
  const [selectedMode, setSelectedMode] = useState("review");
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);
  const [confidence, setConfidence] = useState(85);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.selectedMode) setSelectedMode(parsed.selectedMode);
        if (parsed.rules) setRules(parsed.rules);
        if (parsed.confidence !== undefined) setConfidence(parsed.confidence);
      } catch {}
    }
  }, []);

  const handleSaveAll = () => {
    const payload = { selectedMode, rules, confidence };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const deleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsRuleModalOpen(true);
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (rule: Rule) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === rule.id ? rule : r));
    } else {
      setRules([...rules, rule]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automation Centre</h1>
          <p className="text-slate-400">Configure how MailMind handles your inbox autonomously.</p>
        </div>
        {/* Global Save Button */}
        <button
          onClick={handleSaveAll}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg",
            saveStatus === "saved"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
          )}
        >
          {saveStatus === "saved"
            ? <><CheckCircle className="w-4 h-4" /> Settings Saved!</>
            : <><Save className="w-4 h-4" /> Save All Settings</>
          }
        </button>
      </div>

      {/* Automation Modes */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" /> Automation Mode
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {automationModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={cn(
                "flex flex-col p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group",
                selectedMode === mode.id 
                  ? `${mode.borderColor} ${mode.bgColor} ring-2 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10` 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500", mode.bgColor, mode.color)}>
                <mode.icon className="w-6 h-6" />
              </div>
              <h3 className={cn("text-lg font-bold mb-2", selectedMode === mode.id ? "text-slate-100" : "text-slate-300")}>
                {mode.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {mode.description}
              </p>
              
              {selectedMode === mode.id && (
                <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                  <CheckCircle className={cn("w-5 h-5", mode.color)} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Custom Rules */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" /> Custom Automation Rules
          </h2>
          <button 
            onClick={handleCreateRule}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Create New Rule
          </button>
        </div>

        <div className="bg-slate-900/30 rounded-2xl border border-slate-800 divide-y divide-slate-800">
          {rules.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No custom rules yet. Create one to get started!
            </div>
          ) : rules.map((rule) => (
            <div key={rule.id} className="p-6 flex items-center justify-between group hover:bg-slate-900/40 transition-colors">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    rule.isActive ? "bg-indigo-600/10 text-indigo-400 ring-4 ring-indigo-500/5" : "bg-slate-800 text-slate-500"
                  )}
                >
                  {rule.isActive ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                </button>
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-3">
                    {rule.name}
                    {!rule.isActive && <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded uppercase">Inactive</span>}
                  </div>
                  <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                    <span className="font-medium text-slate-500 italic">IF</span> {rule.trigger}
                    <ArrowRight className="w-3 h-3 text-slate-700" />
                    <span className="font-medium text-slate-500 italic">THEN</span> {rule.action}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditRule(rule)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-red-400/70 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence Thresholds */}
      <section className="p-8 rounded-2xl bg-indigo-600/5 border border-indigo-500/20 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Confidence Threshold</h2>
            <p className="text-sm text-slate-400">Only take autonomous actions when AI confidence is above this level.</p>
          </div>
          <div className="text-3xl font-bold text-indigo-400">{confidence}%</div>
        </div>
        <div className="relative pt-4">
          <input 
            type="range" 
            min="50" 
            max="100" 
            value={confidence} 
            onChange={(e) => setConfidence(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
          <div 
            className="absolute top-4 left-0 h-2 bg-indigo-500 rounded-full pointer-events-none shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
            style={{ width: `${(confidence - 50) * 2}%` }}
          />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className={cn(
            "flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors",
            confidence > 80 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"
          )}>
            <CheckCircle className="w-3.5 h-3.5" /> 
            {confidence > 80 ? `${confidence}% is High Confidence` : `${confidence}% is Balanced`}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <Clock className="w-3.5 h-3.5" /> 
            {saveStatus === "saved" ? "Saved!" : "Unsaved changes"}
          </div>
        </div>
      </section>

      {/* Bottom Save Reminder */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg",
            saveStatus === "saved"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
          )}
        >
          {saveStatus === "saved"
            ? <><CheckCircle className="w-4 h-4" /> All Settings Saved!</>
            : <><Save className="w-4 h-4" /> Save All Settings</>
          }
        </button>
      </div>

      <RuleModal 
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onSave={handleSaveRule}
        initialRule={editingRule}
      />
    </div>
  );
}
