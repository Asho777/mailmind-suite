"use client";

import React, { useState } from "react";
import { 
  Check, 
  ArrowRight, 
  Mail, 
  Zap, 
  Palette, 
  ShieldCheck, 
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Welcome", icon: Sparkles },
  { id: 2, name: "Connect", icon: Mail },
  { id: 3, name: "Your Style", icon: Palette },
  { id: 4, name: "Automation", icon: Zap },
  { id: 5, name: "Ready", icon: Check },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Progress Header */}
      <div className="max-w-xl w-full mb-12 relative z-10">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                currentStep >= step.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-110" : "bg-slate-900 text-slate-500 border border-slate-800"
              )}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                currentStep >= step.id ? "text-indigo-400" : "text-slate-600"
              )}>{step.name}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-900 -z-10 mx-5">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-10 shadow-2xl relative z-10 min-h-[500px] flex flex-col">
        
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col items-center text-center space-y-6 py-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/20 rotate-3">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome to MailMind</h1>
            <p className="text-lg text-slate-400 max-w-md">
              The autonomous AI email agent that learns your voice and handles your inbox exactly the way you would.
            </p>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-sm text-slate-500 flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>We prioritize your privacy. Your email data is never stored outside your private database and is only shared with OpenAI for analysis.</span>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Connect Your Email</h2>
              <p className="text-slate-400">MailMind works with Gmail, Outlook, and Bigpond (IMAP).</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-between p-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">G</div>
                  Connect with Gmail
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">O</div>
                  Connect with Outlook
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-indigo-400">Custom IMAP (Bigpond, etc.)</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Email Address" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-600" />
                  <input type="password" placeholder="Password / App Password" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Your Communication Style</h2>
              <p className="text-slate-400">Tell us how you'd like your replies to sound.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Tone</label>
                {["Formal", "Semi-Formal", "Casual"].map((t) => (
                  <button key={t} className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/50 text-left text-sm hover:border-indigo-600 transition-all flex items-center justify-between">
                    {t}
                    {t === "Semi-Formal" && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Typical Length</label>
                {["Concise", "Balanced", "Detailed"].map((l) => (
                  <button key={l} className="w-full p-3 rounded-lg border border-slate-800 bg-slate-950/50 text-left text-sm hover:border-indigo-600 transition-all flex items-center justify-between">
                    {l}
                    {l === "Balanced" && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Mode</h2>
              <p className="text-slate-400">Select how much control you want to start with.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "Review Mode", desc: "I want to approve every draft before it's sent.", icon: ShieldCheck, active: true },
                { name: "Selective Autopilot", desc: "Auto-send for specific rules, review the rest.", icon: Zap },
                { name: "Watch Mode", desc: "Just analyse and label my emails for now.", icon: Eye },
              ].map((m) => (
                <button key={m.name} className={cn(
                  "p-5 rounded-2xl border text-left flex gap-5 transition-all group",
                  m.active ? "bg-indigo-600/10 border-indigo-500/50 ring-1 ring-indigo-500/20" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", m.active ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-500")}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{m.name}</h3>
                    <p className="text-sm text-slate-500">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="flex-1 flex flex-col items-center text-center space-y-6 py-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">You're All Set!</h1>
            <p className="text-lg text-slate-400 max-w-md">
              MailMind is now ready to sync and analyse your inbox. Reclaim your time and let your AI agent handle the rest.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 animate-pulse">
              <Sparkles className="w-4 h-4" /> Finalising your AI Style Profile...
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-10 flex items-center justify-between pt-8 border-t border-slate-800">
          <button 
            onClick={prevStep}
            className={cn(
              "px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-100 transition-colors",
              currentStep === 1 && "opacity-0 pointer-events-none"
            )}
          >
            Back
          </button>
          <button 
            onClick={currentStep === 5 ? () => window.location.href = '/' : nextStep}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
          >
            {currentStep === 5 ? "Go to Dashboard" : "Continue"}
            {currentStep !== 5 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex items-center gap-6 text-[10px] font-bold text-slate-700 uppercase tracking-widest relative z-10">
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted Data</span>
        <span className="flex items-center gap-1.5"><Info className="w-3 h-3" /> Cancel Anytime</span>
        <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Powered by GPT-4o</span>
      </div>
    </div>
  );
}

// Add Eye icon
function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}
