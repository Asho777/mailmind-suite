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
  RefreshCw,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";
import EmailDetail from "@/components/EmailDetail";

const initialEmails = [
  {
    id: "1",
    from: "James Wilson",
    subject: "Project Update - Q3 Roadmap",
    preview: "Hi there, I wanted to follow up on our discussion regarding the Q3 roadmap and the specific milestones we need to hit...",
    time: "10:24 AM",
    isRead: false,
    isStarred: true,
    priority: "Urgent",
    priorityColor: "bg-red-500",
  },
  {
    id: "2",
    from: "Sarah Jenkins",
    subject: "Invoice #4592 - Design Services",
    preview: "Please find attached the invoice for the design services provided last month. Let me know if you have any questions.",
    time: "9:15 AM",
    isRead: true,
    isStarred: false,
    priority: "Important",
    priorityColor: "bg-orange-500",
    hasAttachment: true,
  },
  {
    id: "3",
    from: "Newsletter | Product Hunt",
    subject: "Top Products of the Week",
    preview: "This week saw some incredible launches! Check out the top 10 products that the community is raving about...",
    time: "Yesterday",
    isRead: true,
    isStarred: false,
    priority: "Normal",
    priorityColor: "bg-yellow-500",
  },
  {
    id: "4",
    from: "Microsoft Outlook",
    subject: "Security Alert: New Login detected",
    preview: "A new login was detected for your account navcocctv@bigpond.com from a new device in Melbourne, Australia.",
    time: "Yesterday",
    isRead: false,
    isStarred: false,
    priority: "Urgent",
    priorityColor: "bg-red-500",
  },
];

export default function InboxPage() {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleSelectAll = () => {
    if (selectedEmailIds.length === emails.length) {
      setSelectedEmailIds([]);
    } else {
      setSelectedEmailIds(emails.map(e => e.id));
    }
  };

  const toggleSelectEmail = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedEmailIds.includes(id)) {
      setSelectedEmailIds(selectedEmailIds.filter(i => i !== id));
    } else {
      setSelectedEmailIds([...selectedEmailIds, id]);
    }
  };

  const handleAction = (action: string, id?: string) => {
    const idsToProcess = id ? [id] : selectedEmailIds;
    if (idsToProcess.length === 0) return;

    if (action === "delete") {
      setEmails(emails.filter(e => !idsToProcess.includes(e.id)));
    } else if (action === "archive") {
      setEmails(emails.filter(e => !idsToProcess.includes(e.id)));
      alert(`${idsToProcess.length} email(s) archived.`);
    } else if (action === "read") {
      setEmails(emails.map(e => idsToProcess.includes(e.id) ? { ...e, isRead: true } : e));
    } else if (action === "snooze") {
      setEmails(emails.filter(e => !idsToProcess.includes(e.id)));
      alert(`${idsToProcess.length} email(s) snoozed.`);
    }

    setSelectedEmailIds([]);
  };

  const refreshInbox = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  if (selectedEmail) {
    return <EmailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Inbox Toolbar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-900/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={selectedEmailIds.length === emails.length && emails.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600/50" 
            />
            <button 
              onClick={refreshInbox}
              className={cn("p-1.5 rounded-md hover:bg-slate-800 text-slate-400", isRefreshing && "animate-spin")}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          <div className="flex items-center gap-1">
            <button 
              disabled={selectedEmailIds.length === 0}
              onClick={() => handleAction("read")}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-opacity"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
            <button 
              disabled={selectedEmailIds.length === 0}
              onClick={() => handleAction("archive")}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-opacity"
              title="Archive"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button 
              disabled={selectedEmailIds.length === 0}
              onClick={() => handleAction("delete")}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400 disabled:opacity-20 transition-opacity"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              disabled={selectedEmailIds.length === 0}
              onClick={() => handleAction("snooze")}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 disabled:opacity-20 transition-opacity"
              title="Snooze"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sort:</span>
            <select className="bg-transparent text-xs font-semibold text-slate-300 border-none focus:ring-0 outline-none cursor-pointer">
              <option>Newest First</option>
              <option>Priority</option>
              <option>Unread</option>
            </select>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">1-{emails.length} of {emails.length}</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 disabled:opacity-30" disabled>
                &larr;
              </button>
              <button className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400">
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Inbox className="w-16 h-16 opacity-10 mb-4" />
            <p className="text-sm font-medium">Your inbox is clear! 🎉</p>
          </div>
        ) : (
          emails.map((email) => (
            <div 
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={cn(
                "group flex items-center gap-4 px-6 py-3 border-b border-slate-900/50 hover:bg-slate-900/40 transition-colors cursor-pointer relative overflow-hidden",
                !email.isRead && "bg-indigo-600/5"
              )}
            >
              {/* Priority Indicator */}
              <div className={cn("absolute left-0 top-0 bottom-0 w-1", email.priorityColor)} />

              {/* Selection & Star */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={selectedEmailIds.includes(email.id)}
                  onChange={(e) => {}} // Handled by container click
                  onClick={(e) => toggleSelectEmail(e, email.id)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-600/50" 
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEmails(emails.map(ev => ev.id === email.id ? { ...ev, isStarred: !ev.isStarred } : ev));
                  }}
                  className={cn(
                    "hover:text-yellow-500 transition-colors",
                    email.isStarred ? "text-yellow-500" : "text-slate-600"
                  )}
                >
                  <Star className={cn("w-4 h-4", email.isStarred && "fill-current")} />
                </button>
              </div>

              {/* Sender & Content */}
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <span className={cn(
                  "w-48 truncate text-sm",
                  !email.isRead ? "font-bold text-slate-50" : "font-medium text-slate-400"
                )}>
                  {email.from}
                </span>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "truncate text-sm",
                      !email.isRead ? "font-bold text-slate-50" : "font-medium text-slate-300"
                    )}>
                      {email.subject}
                    </span>
                    {email.hasAttachment && <Paperclip className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                  </div>
                  <p className="truncate text-xs text-slate-500 mt-0.5">
                    {email.preview}
                  </p>
                </div>
              </div>

              {/* Time & Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAction("archive", email.id); }} 
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAction("delete", email.id); }} 
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAction("snooze", email.id); }} 
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs font-medium text-slate-500 w-16 text-right">
                  {email.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
