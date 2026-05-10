"use client";

import React, { useState, useRef } from "react";
import { X, Send, Paperclip, Smile, Image, MoreHorizontal, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTo?: string;
}

export default function ComposeModal({ isOpen, onClose, initialTo = "" }: ComposeModalProps) {
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  React.useEffect(() => {
    if (initialTo) setTo(initialTo);
  }, [initialTo]);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonEmojis = ["😊", "👍", "👋", "🚀", "✨", "📅", "✅", "📍", "🤝", "💡", "🙌", "🔥"];

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!to) return alert("Please specify a recipient.");
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    onClose();
    alert(`Email sent to ${to}!`);
    setTo("");
    setSubject("");
    setMessage("");
    setAttachments([]);
  };

  const handleDiscard = () => {
    if (message || subject || to) {
      if (confirm("Discard this draft?")) {
        setTo("");
        setSubject("");
        setMessage("");
        setAttachments([]);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const addTemplate = (content: string) => {
    setMessage(prev => prev + (prev ? "\n\n" : "") + content);
    setShowTemplates(false);
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => f.name);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        className="hidden" 
      />
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 rounded-t-2xl">
          <h3 className="font-bold text-slate-200">New Message</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="p-2 space-y-1">
          <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-800/50">
            <span className="text-sm text-slate-500 font-medium min-w-[40px]">To</span>
            <input 
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 outline-none"
              placeholder="recipients@example.com"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-800/50">
            <span className="text-sm text-slate-500 font-medium min-w-[40px]">Subject</span>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 outline-none"
              placeholder="What's this about?"
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col min-h-[300px]">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-300 resize-none outline-none"
            placeholder="Write your message here..."
          />
          
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] text-slate-300 font-bold">
                  <Paperclip className="w-3 h-3" />
                  {file}
                  <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="hover:text-red-400 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSend}
              disabled={isSending || !to}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              {isSending ? "Sending..." : "Send"}
              {!isSending && <Send className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1 ml-2">
              <button 
                onClick={handleAttach}
                className="p-2 rounded-md hover:bg-slate-800 text-slate-400" 
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={cn(
                    "p-2 rounded-md hover:bg-slate-800 text-slate-400",
                    showEmojis && "text-indigo-400 bg-indigo-400/10"
                  )} 
                  title="Insert emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
                {showEmojis && (
                  <div className="absolute bottom-full mb-2 left-0 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 w-56">
                    <div className="px-1 py-1 border-b border-slate-800 mb-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Emoji</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {commonEmojis.map((emoji) => (
                        <button 
                          key={emoji}
                          onClick={() => {
                            setMessage(prev => prev + emoji);
                            setShowEmojis(false);
                          }}
                          className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={cn(
                    "p-2 rounded-md hover:bg-slate-800 text-slate-400",
                    showTemplates && "text-indigo-400 bg-indigo-400/10"
                  )} 
                  title="Templates"
                >
                  <FileText className="w-4 h-4" />
                </button>
                {showTemplates && (
                  <div className="absolute bottom-full mb-2 left-0 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="px-4 py-1 border-b border-slate-800 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saved Templates</span>
                    </div>
                    <button onClick={() => addTemplate("Hi, thanks for your inquiry. I'll get back to you shortly.")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Quick Acknowledge</button>
                    <button onClick={() => addTemplate("Please find the requested documentation attached below.")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Send Documentation</button>
                    <button onClick={() => addTemplate("Let's jump on a call tomorrow at 10am to discuss this further.")} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Schedule Call</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  "p-2 rounded-md hover:bg-slate-800 text-slate-400",
                  showMore && "text-indigo-400 bg-indigo-400/10"
                )}
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMore && (
                <div className="absolute bottom-full mb-2 right-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <button onClick={() => { alert("Spell check complete. No errors found."); setShowMore(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Check Spelling</button>
                  <button onClick={() => { alert("Switched to Plain Text mode."); setShowMore(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Plain Text Mode</button>
                  <div className="h-[1px] bg-slate-800 my-1" />
                  <button onClick={() => { alert("Schedule send set for tomorrow at 9:00 AM."); setShowMore(false); }} className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Schedule Send...</button>
                </div>
              )}
            </div>
            <div className="h-4 w-[1px] bg-slate-800 mx-1" />
            <button 
              onClick={handleDiscard}
              className="p-2 rounded-md hover:bg-slate-800 text-slate-500 hover:text-red-400"
              title="Discard draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
