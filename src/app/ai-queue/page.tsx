"use client";

import React, { useState, useEffect } from "react";
import MailView from "@/components/MailView";

const initialQueue = [
  {
    id: "q1",
    from: "Support Team",
    subject: "Ticket #8234 Update",
    preview: "Processing your request regarding the server migration. We will have an update shortly.",
    time: "Just now",
    isRead: false,
    isStarred: false,
    priority: "AI Processing",
    priorityColor: "bg-indigo-500 animate-pulse",
  },
  {
    id: "q2",
    from: "GitHub",
    subject: "[Security] Advisory for project-x",
    preview: "A new security advisory has been published for one of your dependencies. AI is assessing impact.",
    time: "2 mins ago",
    isRead: false,
    isStarred: false,
    priority: "AI Processing",
    priorityColor: "bg-indigo-500 animate-pulse",
  },
  {
    id: "q3",
    from: "AWS Notifications",
    subject: "Monthly Bill Ready",
    preview: "Your monthly AWS bill is now available in the billing console. AI is categorizing expense...",
    time: "5 mins ago",
    isRead: true,
    isStarred: false,
    priority: "AI Processing",
    priorityColor: "bg-indigo-500 animate-pulse",
  }
];

export default function AiQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/emails?status=new");
        if (res.ok) {
          const data = await res.json();
          setQueue(data);
        }
      } catch (err) {
        console.error("Failed to fetch queue:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000); // Check frequently since it's the queue
    return () => clearInterval(interval);
  }, []);

  return (
    <MailView 
      title="AI Queue" 
      emails={queue} 
      emptyMessage="The AI is all caught up! No emails currently being processed." 
    />
  );
}
