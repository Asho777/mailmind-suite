"use client";

import React, { useState, useEffect } from "react";
import MailView from "@/components/MailView";

const initialHandled = [
  {
    id: "h1",
    from: "Marketing Team",
    subject: "Monthly Newsletter Review",
    preview: "Draft created and scheduled for review. AI suggests the tone is appropriate for current campaign.",
    time: "Today",
    isRead: true,
    isStarred: false,
    priority: "Handled",
    priorityColor: "bg-emerald-500",
  },
  {
    id: "h2",
    from: "Billing",
    subject: "Receipt for Order #1293",
    preview: "AI has automatically archived this receipt and extracted data for analytics.",
    time: "Yesterday",
    isRead: true,
    isStarred: false,
    priority: "Archived",
    priorityColor: "bg-slate-500",
  }
];

export default function HandledPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("/api/emails?status=archived");
        if (res.ok) {
          const data = await res.json();
          setEmails(data);
        }
      } catch (err) {
        console.error("Failed to fetch handled:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchEmails();
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action: string, ids: string[]) => {
    try {
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids }),
      });
      if (res.ok && action === "delete") {
        setEmails(prev => prev.filter(e => !ids.includes(e.id)));
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <MailView 
      title="Handled by AI" 
      emails={emails} 
      emptyMessage="No emails have been processed yet." 
      onAction={handleAction}
    />
  );
}
