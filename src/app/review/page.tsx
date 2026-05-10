"use client";

import MailView from "@/components/MailView";

const mockReview = [
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
  return (
    <MailView 
      title="Review Needed" 
      emails={mockReview} 
      emptyMessage="Great job! No emails currently require your manual review." 
    />
  );
}
