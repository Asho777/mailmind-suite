"use client";

import MailView from "@/components/MailView";

const mockHandled = [
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
  return (
    <MailView 
      title="Handled by AI" 
      emails={mockHandled} 
      emptyMessage="No emails have been processed yet." 
    />
  );
}
