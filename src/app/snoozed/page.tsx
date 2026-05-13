"use client";

import React, { useState, useEffect } from "react";
import MailView from "@/components/MailView";

const initialSnoozed = [
  {
    id: "s1",
    from: "Conference Organizers",
    subject: "Speaker Invitation: Tech Summit 2026",
    preview: "Snoozed until Monday morning. AI will remind you to check your calendar then.",
    time: "Mon 9:00 AM",
    isRead: true,
    isStarred: false,
    priority: "Snoozed",
    priorityColor: "bg-amber-500",
  }
];

export default function SnoozedPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("/api/emails?status=snoozed");
        if (res.ok) {
          const data = await res.json();
          setEmails(data);
        }
      } catch (err) {
        console.error("Failed to fetch snoozed:", err);
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
      title="Snoozed" 
      emails={emails} 
      emptyMessage="No snoozed emails at the moment." 
      onAction={handleAction}
    />
  );
}
