import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isCounts = searchParams.get("counts");
    
    if (isCounts === "true") {
      const allEmails = await prisma.email.findMany({ select: { status: true } });
      const counts = {
        inbox: allEmails.filter(e => ["new", "analysed", "draft_ready"].includes(e.status)).length,
        queue: allEmails.filter(e => e.status === "new").length,
        review: allEmails.filter(e => e.status === "draft_ready").length,
        handled: allEmails.filter(e => e.status === "archived").length,
        snoozed: allEmails.filter(e => e.status === "snoozed").length,
      };
      return NextResponse.json(counts);
    }

    const statusFilter = searchParams.get("status");

    const whereClause: any = {};
    if (statusFilter) {
      if (statusFilter === "inbox") {
        whereClause.status = { in: ["new", "analysed", "draft_ready"] };
      } else {
        whereClause.status = statusFilter;
      }
    }

    const emails = await prisma.email.findMany({
      where: whereClause,
      include: {
        analysis: true,
      },
      orderBy: {
        receivedAt: "desc",
      },
    });

    // Map Prisma models to the UI Email interface
    const mappedEmails = emails.map(email => ({
      id: email.id,
      from: email.from,
      subject: email.subject || "(No Subject)",
      preview: email.bodyText ? email.bodyText.substring(0, 100) + "..." : "No preview available",
      time: email.receivedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: email.isRead,
      isStarred: email.isStarred,
      priority: email.analysis?.priorityReason || (email.status === "new" ? "Pending Analysis" : "Normal"),
      priorityColor: getPriorityColor(email.analysis?.priority, email.status),
      hasAttachment: false, // Implement attachments later if needed
    }));

    return NextResponse.json(mappedEmails);
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

function getPriorityColor(priorityLevel?: number | null, status?: string) {
  if (status === "new") return "bg-slate-500 animate-pulse";
  if (priorityLevel === 1) return "bg-red-500";
  if (priorityLevel === 2) return "bg-amber-500";
  if (priorityLevel === 3) return "bg-blue-500";
  return "bg-slate-600";
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ids } = body;
    
    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    let updated;

    if (action === "read") {
      updated = await prisma.email.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      });
    } else if (action === "archive") {
      updated = await prisma.email.updateMany({
        where: { id: { in: ids } },
        data: { status: "archived" },
      });
    } else if (action === "delete") {
      // Hard delete from the DB or just mark status="deleted"? 
      // The user wants them permanently removed.
      updated = await prisma.email.deleteMany({
        where: { id: { in: ids } },
      });
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error: any) {
    console.error("Error updating emails:", error);
    return NextResponse.json({ error: "Failed to update emails" }, { status: 500 });
  }
}
