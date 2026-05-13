"use client";

import React, { useState } from "react";
import { 
  Archive, 
  Trash2, 
  Clock, 
  MoreVertical, 
  Star, 
  Paperclip,
  Check,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import EmailDetail from "@/components/EmailDetail";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  priority: string;
  priorityColor: string;
  hasAttachment?: boolean;
}

interface MailViewProps {
  title: string;
  emails: Email[];
  emptyMessage?: string;
  onAction?: (action: string, ids: string[]) => void;
}

export default function MailView({ title, emails: initialEmails, emptyMessage = "No emails found in this view.", onAction }: MailViewProps) {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emails, setEmails] = useState(initialEmails);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // all, unread, starred
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (selectedEmail) {
    return <EmailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
  }

  const filteredEmails = emails.filter(e => {
    const matchesSearch = e.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.from.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "unread") return matchesSearch && !e.isRead;
    if (activeFilter === "starred") return matchesSearch && e.isStarred;
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEmails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmails.map(e => e.id));
    }
  };

  const toggleSelectOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = (action: string, singleId?: string) => {
    const idsToProcess = singleId ? [singleId] : selectedIds;
    if (idsToProcess.length === 0) return;

    // Local state update
    setEmails(prev => prev.filter(e => !idsToProcess.includes(e.id)));
    setSelectedIds([]);

    // Optional parent callback
    if (onAction) onAction(action, idsToProcess);
    
    if (action === "archive") alert(`${idsToProcess.length} email(s) moved to Handled.`);
    if (action === "delete") alert(`${idsToProcess.length} email(s) deleted.`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 animate-in fade-in duration-500">
      {/* View Header */}
      <div className="px-6 py-6 border-b border-slate-900 bg-slate-900/10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search in this view..." 
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-indigo-600/50 transition-all outline-none text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2 rounded-lg bg-slate-900 border transition-all flex items-center gap-2",
                  showFilters || activeFilter !== "all" ? "border-indigo-500 text-indigo-400" : "border-slate-800 text-slate-400 hover:text-white"
                )}
              >
                <Filter className="w-4 h-4" />
                {activeFilter !== "all" && <span className="text-[10px] font-bold uppercase">{activeFilter}</span>}
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                  {["all", "unread", "starred"].map((f) => (
                    <button
                      key={f}
                      onClick={() => { setActiveFilter(f); setShowFilters(false); }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-800 transition-colors capitalize",
                        activeFilter === f ? "text-indigo-400 bg-indigo-400/5" : "text-slate-400"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ... existing toolbar ... */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={selectedIds.length === filteredEmails.length && filteredEmails.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600/50" 
              />
              <button 
                onClick={handleRefresh}
                className={cn("p-1.5 rounded-md hover:bg-slate-800 text-slate-400", isRefreshing && "animate-spin")}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-1">
              <button 
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkAction("read")}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-opacity"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkAction("archive")}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-opacity"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button 
                disabled={selectedIds.length === 0}
                onClick={() => handleBulkAction("delete")}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 disabled:opacity-20 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">{filteredEmails.length} messages</span>
            <select className="bg-transparent text-[10px] font-bold text-slate-400 border-none focus:ring-0 outline-none cursor-pointer uppercase tracking-widest">
              <option className="text-slate-900">Newest First</option>
              <option className="text-slate-900">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <Archive className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-sm font-medium">{emptyMessage}</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div 
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={cn(
                "group flex items-center gap-4 px-6 py-3 border-b border-slate-900/50 hover:bg-slate-900/40 transition-colors cursor-pointer relative",
                !email.isRead && "bg-indigo-600/5",
                openMenuId === email.id ? "z-50 bg-slate-900/60" : "z-0"
              )}
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1", email.priorityColor)} />
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(email.id)}
                  onChange={() => {}}
                  onClick={(e) => toggleSelectOne(e, email.id)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600/50" 
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEmails(prev => prev.map(ev => ev.id === email.id ? { ...ev, isStarred: !ev.isStarred } : ev));
                  }} 
                  className={cn("hover:text-yellow-500 transition-colors", email.isStarred ? "text-yellow-500" : "text-slate-600")}
                >
                  <Star className={cn("w-4 h-4", email.isStarred && "fill-current")} />
                </button>
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <span className={cn("w-48 truncate text-sm", !email.isRead ? "font-bold text-slate-50" : "font-medium text-slate-400")}>{email.from}</span>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={cn("truncate text-sm", !email.isRead ? "font-bold text-slate-50" : "font-medium text-slate-300")}>{email.subject}</span>
                    {email.hasAttachment && <Paperclip className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                  </div>
                  <p className="truncate text-xs text-slate-500 mt-0.5">{email.preview}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleBulkAction("archive", email.id); }} 
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleBulkAction("delete", email.id); }} 
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const id = email.id;
                        setOpenMenuId(prev => prev === id ? null : id);
                      }} 
                      className={cn(
                        "p-1.5 rounded-md hover:bg-slate-800 transition-colors",
                        openMenuId === email.id ? "text-indigo-400 bg-indigo-400/10" : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === email.id && (
                      <div 
                        key={`menu-${email.id}`}
                        className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-200"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                        >
                          Mark as Urgent
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                        >
                          Add to Templates
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border-t border-slate-800 mt-1 pt-2"
                        >
                          Mute Thread
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500 w-16 text-right">{email.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
