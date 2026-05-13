"use client";

import React, { useState, useEffect } from "react";
import MailView from "@/components/MailView";

const initialReview = [
  {
    id: "r1",
    from: "CEO | Navco CCTV",
    subject: "Strategic Planning for 2027",
    preview: "I need your thoughts on the expansion plans. AI cannot confidently draft this without your specific input.",
    time: "1 hour ago",
    isRead: false,
    isStarred: true,
    priority: "Review Required",
    priorityColor: "bg-red-500",
  },
  {
    id: "r2",
    from: "Investor Relations",
    subject: "Draft Response for Q2 Earnings",
    preview: "AI has drafted a response, but it contains sensitive financial data that requires verification.",
    time: "4 hours ago",
    isRead: false,
    isStarred: false,
    priority: "Review Required",
    priorityColor: "bg-red-500",
  }
];

export default function ReviewPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("/api/emails?status=draft_ready");
        if (res.ok) {
          const data = await res.json();
          setEmails(data);
        }
      } catch (err) {
        console.error("Failed to fetch review:", err);
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
      title="Review Needed" 
      emails={emails} 
      emptyMessage="Great job! No emails currently require your manual review." 
      onAction={handleAction}
    />
  );
}
