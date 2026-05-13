"use client";

import React from "react";
import { 
  BookOpen, 
  Settings, 
  Inbox, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  BarChart2, 
  FileText, 
  Users,
  ChevronRight,
  ShieldCheck,
  Cpu,
  MousePointer2,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const guideSteps = [
  {
    id: "step-1",
    title: "1. The Setup: Fueling the AI",
    icon: Settings,
    color: "text-indigo-400",
    objective: "Connect your email and activate the AI 'Brain'.",
    content: "Before MailMind can work its magic, it needs two things: access to your email (via IMAP) and access to the AI brain (via OpenAI). Both are configured in Settings → AI Connection and Settings → Connected Emails. This phase walks you through each one.",
    details: [
      { 
        option: "Step 1 → Settings → AI Connection → OpenAI API Key", 
        how: "Your OpenAI API Key is the licence key that lets MailMind use the AI. Go to platform.openai.com/api-keys, sign in (or create a free account), click 'Create new secret key', copy the key that starts with 'sk-', then paste it into the OpenAI API Key field. Click 'Test Connection' to verify it works, then 'Save Keys to .env'.", 
        benefit: "Enables smart categorisation, auto-drafting of replies, and intelligent priority scoring for every email you receive." 
      },
      { 
        option: "Step 2 → Settings → AI Connection → Encryption Key", 
        how: "The Encryption Key is a private 32-character password that YOU create — it does NOT come from OpenAI or anywhere online. MailMind uses it to scramble your stored email password on your HDD so it cannot be read in plain text by anyone who opens your files. Click the '⚡ Generate for Me' button — a secure random key is created instantly. IMPORTANT: Copy this key and store it in a safe place such as a password manager or a written note kept securely. Then click 'Save Keys to .env'. If you ever lose this key, your stored email password cannot be recovered.", 
        benefit: "Your email credentials are stored securely on your local hard drive. Even if someone accesses your computer files, all passwords appear as unreadable scrambled text." 
      },
      { 
        option: "Step 3 → Settings → Connected Emails → Connect Account", 
        how: "Go to Settings → Connected Emails. Click 'Connect New Account'. Enter your email address and password, then your IMAP server address (e.g. imap.telstra.com for Bigpond) and port 993. Click 'Test Connection' to confirm the details are correct, then 'Verify & Connect' to save.", 
        benefit: "MailMind can now fetch your real emails directly and process them through the AI — all privately on your local machine." 
      }
    ]
  },
  {
    id: "step-2",
    title: "2. The Inbox & AI Triage",
    icon: Inbox,
    color: "text-blue-400",
    objective: "Understand how MailMind sorts and filters your incoming mail.",
    content: "Once connected, your emails are synced locally. MailMind doesn't just display them — it instantly sends them through the AI 'Brain' to be analyzed, categorized, and scored for priority. You no longer have to read every email to know if it's junk.",
    details: [
      { 
        option: "The Main Inbox", 
        how: "This is your raw, unfiltered feed. Every email arrives here first. Click on any email to view its contents, see the AI's priority score, and manually reply or delete. Emails deleted here are permanently removed from your local storage.", 
        benefit: "A standard, familiar view of all incoming messages before the AI moves them." 
      },
      { 
        option: "The AI Queue", 
        how: "As the AI processes your Inbox, it places emails here that it is actively working on. You can watch it assign tags (e.g. 'Invoice', 'Spam', 'Urgent') in real-time.", 
        benefit: "Total transparency into what the AI is analyzing at any given moment." 
      },
      { 
        option: "Review Needed", 
        how: "If the AI drafts a reply or categorizes an email but isn't 100% confident (based on your Confidence Barrier setting), it pauses and places the email here. You simply click 'Approve' or 'Edit' to finalize the action.", 
        benefit: "Ensures the AI never sends an incorrect reply or deletes an important email without your explicit permission." 
      },
      { 
        option: "Handled & Snoozed", 
        how: "'Handled' is your archive of emails the AI successfully processed and replied to automatically. 'Snoozed' contains emails you told the AI to hide until a specific date or time.", 
        benefit: "Maintains a clean paper trail of every automated action taken, so you are never left guessing what happened to an email." 
      }
    ]
  },
  {
    id: "step-3",
    title: "3. Automation: Setting the Rules",
    icon: Zap,
    color: "text-amber-400",
    objective: "Tell the AI exactly what to do when you're sleeping or busy.",
    content: "The 'Automation' page is the control center. Here, you define the boundaries of what the AI is allowed to do automatically, from just watching to sending emails on your behalf.",
    details: [
      { 
        option: "Automation Modes", 
        how: "Choose your comfort level. 'Watch Mode' only tags emails (safest). 'Review Mode' drafts replies but requires you to click 'Approve' (recommended). 'Autopilot Mode' drafts and sends replies completely automatically (for power users).", 
        benefit: "Gives you complete control over how aggressive the AI is, ensuring it matches your comfort level." 
      },
      { 
        option: "Custom Rules", 
        how: "Create specific IF/THEN statements. Example: IF sender contains 'amazon' AND subject contains 'invoice' THEN automatically mark as 'Handled' and tag as 'Receipts'. You can toggle these rules on and off individually.", 
        benefit: "Total hands-free management of recurring business tasks and newsletters." 
      },
      { 
        option: "Confidence Barrier", 
        how: "Adjust the slider (e.g., to 85%). If the AI is less than 85% sure about how to handle an email, it will pause and move it to 'Review Needed' instead of acting automatically.", 
        benefit: "You control the strict balance between automation speed and absolute safety." 
      },
      { 
        option: "Saving Settings", 
        how: "Whenever you change a mode, adjust the slider, or toggle a rule, you MUST click the green 'Save All Settings' button at the top or bottom of the page.", 
        benefit: "Ensures your automation preferences are permanently saved to your local drive and survive application restarts." 
      }
    ]
  },
  {
    id: "step-4",
    title: "4. Productivity: Templates & Contacts",
    icon: FileText,
    color: "text-emerald-400",
    objective: "Draft professional replies in seconds without typing.",
    content: "MailMind learns how you write. Using 'Templates' and the 'Contacts' manager, you can standardize your responses and keep track of relationship history.",
    details: [
      { 
        option: "Smart Templates", 
        how: "Create reusable responses like 'Meeting Request' or 'Invoice Follow-up'. Use variables like {{name}} or {{date}}. When you select a template to reply, the AI automatically extracts the person's name from their email and fills it in perfectly.", 
        benefit: "Turn a repetitive 5-minute typing task into a 2-second click." 
      },
      { 
        option: "Contacts Manager", 
        how: "MailMind builds a local database of everyone who emails you. It tracks your relationship history, response times, and frequent topics.", 
        benefit: "Instantly see how long it usually takes for a specific contact to reply, and view all past correspondence in one clean view." 
      },
      { 
        option: "The Compose Window", 
        how: "When clicking 'Compose', you can ask the AI to draft the email for you. Simply type 'Tell John we are meeting on Tuesday at 3pm' and the AI will expand it into a professional, polite email.", 
        benefit: "Eliminates writer's block and ensures your outbound communication is always professional." 
      }
    ]
  },
  {
    id: "step-5",
    title: "5. Analytics: Measuring your Success",
    icon: BarChart2,
    color: "text-purple-400",
    objective: "See exactly how much time the AI is saving you.",
    content: "The 'Analytics' dashboard isn't just for show — it's your efficiency scoreboard. It tracks every action the AI takes so you can visualize your productivity gains.",
    details: [
      { 
        option: "Time Saved Gauge", 
        how: "Calculates the total hours reclaimed based on the number of emails the AI has auto-drafted, categorized, or deleted on your behalf versus your average manual typing speed.", 
        benefit: "Justifies the use of the App by showing clear, measurable Return on Investment (ROI)." 
      },
      { 
        option: "Priority Distribution", 
        how: "A visual chart showing what percentage of your daily inbox is 'Urgent', 'Normal', or 'Low Priority' noise.", 
        benefit: "Helps you realize if you are receiving too much junk mail, prompting you to create new Automation rules to filter it out." 
      },
      { 
        option: "View Time History", 
        how: "Clicking 'View Time History' breaks down your efficiency gains week-by-week, so you can see if your inbox management is improving over time.", 
        benefit: "Provides long-term insights into your communication habits." 
      }
    ]
  }
];

export default function InstructionsPage() {
  const [activeStep, setActiveStep] = React.useState("step-1");

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="relative p-10 rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> 100% Private Local Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Mastering MailMind</h1>
          <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
            Follow this sequential roadmap to transform your inbox from a chaotic mess into a self-managing AI powerhouse.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Rail */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 px-4">Step-by-Step Roadmap</h3>
          {guideSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "w-full flex items-start gap-4 p-5 rounded-2xl transition-all text-left border group relative overflow-hidden",
                activeStep === step.id 
                  ? "bg-slate-900 border-indigo-500/50 text-white shadow-[0_20px_40px_rgba(0,0,0,0.4)]" 
                  : "bg-transparent border-transparent text-slate-500 hover:bg-slate-900/30 hover:text-slate-300"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl bg-slate-950 border border-slate-800 transition-colors",
                activeStep === step.id ? step.color : "text-slate-600 group-hover:text-slate-400"
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-sm font-bold tracking-tight mb-1">{step.title}</div>
                <div className="text-[10px] opacity-60 font-medium leading-tight">{step.objective}</div>
              </div>
              {activeStep === step.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_15px_rgba(99,102,241,1)]" />
              )}
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-8">
          {guideSteps.map((step) => (
            <div 
              key={step.id} 
              className={cn(
                "space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700",
                activeStep !== step.id && "hidden"
              )}
            >
              <div className="p-10 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 space-y-10 relative">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-800/50">
                  <div className={cn("p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl", step.color)}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{step.title}</h2>
                    <p className="text-indigo-400 font-bold text-sm">Strategic Objective: {step.objective}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-xl text-slate-300 leading-relaxed font-medium">
                    {step.content}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {step.details.map((detail, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 group hover:border-indigo-500/20 transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                            <MousePointer2 className="w-3 h-3" /> Setting: {detail.option}
                          </div>
                          <h4 className="text-lg font-bold text-slate-100 leading-snug">{detail.how}</h4>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl lg:max-w-[200px] w-full text-center lg:text-right shrink-0">
                          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 opacity-80">Benefit</div>
                          <div className="text-xs font-bold text-emerald-300 leading-normal">{detail.benefit}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sequential Prompt */}
              <div 
                onClick={() => {
                  const nextIdx = parseInt(step.id.split('-')[1]);
                  if (nextIdx < guideSteps.length) {
                    setActiveStep(`step-${nextIdx + 1}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setActiveStep("step-1");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-600/30 group cursor-pointer active:scale-[0.98] transition-all hover:bg-indigo-500"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white">
                    <div className="text-xs font-bold opacity-70 uppercase tracking-widest mb-0.5">Knowledge Unlocked</div>
                    <div className="text-xl font-black">
                      {parseInt(step.id.split('-')[1]) < guideSteps.length 
                        ? `Move to Phase ${parseInt(step.id.split('-')[1]) + 1}` 
                        : "Back to Phase 1"}
                    </div>
                  </div>
                </div>
                <Zap className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Support Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="p-2 w-fit rounded-lg bg-indigo-500/20 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">About Your Encryption Key</h4>
          <div className="text-sm text-slate-400 leading-relaxed space-y-3">
            <p>The Encryption Key is a <strong className="text-slate-200">password you create yourself</strong> — it does not come from any website or service.</p>
            <p>When you store your email password in MailMind, the app uses this key to <strong className="text-slate-200">scramble it</strong> before saving it to your hard drive. Without the key, stored passwords appear as random unreadable characters.</p>
            <p className="text-amber-300 font-bold">⚠️ If you lose your Encryption Key, stored email passwords cannot be recovered. Always keep a copy in a secure place such as a password manager.</p>
            <p>To create one: go to <strong className="text-slate-200">Settings → AI Connection</strong> and click the <strong className="text-indigo-300">⚡ Generate for Me</strong> button. Copy the result before saving.</p>
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">AI Reliability</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            The AI learns from your 'Review Needed' decisions. The more you approve or correct its drafts, the smarter it becomes at mimicking your personal writing style.
          </p>
        </div>
      </div>
    </div>
  );
}
