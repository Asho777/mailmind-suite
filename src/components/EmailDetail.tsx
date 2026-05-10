"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Trash2, 
  Archive, 
  MoreVertical, 
  Star, 
  Reply, 
  Forward, 
  Check, 
  Zap,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailDetailProps {
  email: any;
  onBack: () => void;
}

export default function EmailDetail({ email, onBack }: EmailDetailProps) {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSenderMenu, setOpenSenderMenu] = useState(false);
  const [isStarred, setIsStarred] = useState(email.isStarred || false);

  const handleAction = (action: string) => {
    if (action === "print") {
      window.print();
      return;
    }
    alert(`Email ${action}ed!`);
    if (action !== "star" && action !== "reply") onBack();
  };

  const handleReply = () => {
    setIsAiPanelOpen(true);
    setTimeout(() => {
      const draftArea = document.querySelector('textarea');
      draftArea?.focus();
    }, 100);
  };

  // Mock AI data ... (rest remains)
  const analysis = {
    type: "Customer Inquiry",
    priority: 8,
    priorityReason: "Potential new business opportunity with a deadline mentioned.",
    summary: [
      "Inquiry about product pricing and availability.",
      "Needs a response by Friday for their board meeting.",
      "Interested in bulk purchase (50+ units)."
    ],
    tone: "Professional & Curious",
    intent: "Purchase Request",
    confidence: 0.94
  };

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Left: Email Content */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isAiPanelOpen ? "lg:mr-0" : ""
      )}>
        {/* Toolbar */}
        <div className="h-12 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/20 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-800 mx-1" />
            <div className="flex items-center gap-1">
              <button onClick={() => handleAction("archive")} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400" title="Archive"><Archive className="w-4 h-4" /></button>
              <button onClick={() => handleAction("delete")} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400" title="Delete"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => setIsStarred(!isStarred)} className={cn("p-1.5 rounded-md hover:bg-slate-800", isStarred ? "text-yellow-500" : "text-slate-400")}>
                <Star className={cn("w-4 h-4", isStarred && "fill-current")} />
              </button>
              <button onClick={() => handleAction("snooze")} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400" title="Snooze"><Clock className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                isAiPanelOpen 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-100"
              )}
            >
              <Zap className={cn("w-3.5 h-3.5", isAiPanelOpen && "fill-current")} />
              AI Analysis
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setOpenMenu(!openMenu)}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  openMenu ? "text-indigo-400 bg-indigo-400/10" : "text-slate-400 hover:bg-slate-800"
                )}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
                  <button onClick={() => { handleAction("read"); setOpenMenu(false); }} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">Mark as Unread</button>
                  <button onClick={() => setOpenMenu(false)} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">Mark as Urgent</button>
                  <button onClick={() => setOpenMenu(false)} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border-t border-slate-800 mt-1 pt-2 text-red-400 hover:text-red-300">Block Sender</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Header */}
        <div className="px-10 py-8 border-b border-slate-900">
          <h1 className="text-2xl font-bold text-slate-100 mb-6">{email.subject}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-lg font-bold border border-white/5 shadow-xl">
                {email.from.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{email.from}</span>
                  <span className="text-xs text-slate-500 font-medium tracking-tight">&lt;{email.from.toLowerCase().replace(/ /g, '.')}@company.com&gt;</span>
                </div>
                <div className="text-sm text-slate-400 mt-0.5">
                  to me • {email.time}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newState = !isAiPanelOpen;
                  setIsAiPanelOpen(newState);
                  if (newState) {
                    setTimeout(() => {
                      const draftArea = document.querySelector('textarea');
                      draftArea?.focus();
                    }, 100);
                  }
                }}
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isAiPanelOpen ? "text-indigo-400 bg-indigo-400/10 rotate-0" : "text-slate-400 hover:bg-slate-800"
                )} 
                title={isAiPanelOpen ? "Close AI Panel" : "Open AI Panel"}
              >
                {isAiPanelOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setOpenSenderMenu(!openSenderMenu)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    openSenderMenu ? "text-indigo-400 bg-indigo-400/10" : "text-slate-400 hover:bg-slate-900"
                  )}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openSenderMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => { handleAction("forward"); setOpenSenderMenu(false); }} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">Forward</button>
                    <button onClick={() => { handleAction("print"); setOpenSenderMenu(false); }} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">Print</button>
                    <button onClick={() => { alert(`Filtering by ${email.from}...`); setOpenSenderMenu(false); }} className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border-t border-slate-800 mt-1 pt-2">Filter messages like this</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto px-10 py-8 prose prose-invert max-w-none scrollbar-thin scrollbar-thumb-slate-800">
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {email.preview}
            {"\n\n"}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            {"\n\n"}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            {"\n\n"}
            Best regards,{"\n"}
            {email.from}
          </p>
        </div>

        {/* Quick Actions (Sticky Bottom) */}
        <div className="p-6 bg-slate-950/80 backdrop-blur-sm border-t border-slate-900 flex gap-4">
          <button 
            onClick={handleReply}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm"
          >
            <Reply className="w-4 h-4" /> Reply
          </button>
          <button 
            onClick={() => handleAction("forward")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm"
          >
            <Forward className="w-4 h-4" /> Forward
          </button>
        </div>
      </div>

      {/* Right: AI Panel */}
      {isAiPanelOpen && (
        <aside className="w-[420px] bg-slate-900/30 border-l border-slate-800 overflow-y-auto animate-in slide-in-from-right duration-300 scrollbar-none">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">AI Intelligence</h3>
              </div>
              <div className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700">
                Confidence: {Math.round(analysis.confidence * 100)}%
              </div>
            </div>

            {/* Analysis Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Priority</div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-lg font-bold",
                    analysis.priority > 7 ? "text-red-400" : "text-emerald-400"
                  )}>{analysis.priority}/10</span>
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", analysis.priority > 7 ? "bg-red-500" : "bg-emerald-500")}
                      style={{ width: `${analysis.priority * 10}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Tone</div>
                <div className="text-sm font-semibold text-slate-200 truncate">{analysis.tone}</div>
              </div>
            </div>

            {/* Priority Reason */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" /> Reasoning
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis.priorityReason}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Key Takeaways
              </h4>
              <ul className="space-y-2">
                {analysis.summary.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-2 rounded-lg border border-transparent hover:border-slate-800 transition-all">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Draft Reply */}
            <div className="space-y-4 pt-4 border-t border-slate-800/50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Suggested Reply
                </h4>
                <button 
                  onClick={() => setIsRegenerating(true)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className={cn("w-3 h-3", isRegenerating && "animate-spin")} />
                  Regenerate
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20" />
                <div className="relative bg-slate-950 rounded-xl border border-indigo-500/30 overflow-hidden">
                  <textarea 
                    value={draft || `Hi ${email.from.split(' ')[0]},\n\nThank you for reaching out about the Q3 roadmap. I've reviewed your request for bulk pricing and would be happy to discuss this further. We can definitely hit the Friday deadline for your board meeting.\n\nCould we jump on a quick call tomorrow at 10am to finalize the details?\n\nBest regards,\nGreg`}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full bg-transparent border-none text-sm p-4 text-slate-300 focus:ring-0 min-h-[200px] outline-none scrollbar-thin scrollbar-thumb-slate-800"
                    placeholder="AI is drafting..."
                  />
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 border-t border-slate-800/50">
                    <span className="text-[10px] text-slate-500 font-medium">Style: Professional & Concise</span>
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                      <Send className="w-3.5 h-3.5" />
                      Send Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

