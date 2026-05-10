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
  const [queue, setQueue] = useState(initialQueue);

  // Simulation: Remove an item after some "processing" time
  useEffect(() => {
    if (queue.length === 0) return;

    const timer = setTimeout(() => {
      // Logic: Move the first item out of the queue (simulate AI finishing it)
      // In a real app, this would happen via backend/websocket
    }, 10000);

    return () => clearTimeout(timer);
  }, [queue]);

  return (
    <MailView 
      title="AI Queue" 
      emails={queue} 
      emptyMessage="The AI is all caught up! No emails currently being processed." 
    />
  );
}
