"use client";

import MailView from "@/components/MailView";

const mockSnoozed = [
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
  return (
    <MailView 
      title="Snoozed" 
      emails={mockSnoozed} 
      emptyMessage="No snoozed emails at the moment." 
    />
  );
}
