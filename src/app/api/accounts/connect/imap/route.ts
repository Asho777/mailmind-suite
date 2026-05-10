import { NextResponse } from "next/server";
import { fetchRecentEmails } from "@/lib/mail/imap";
// import { prisma } from "@/lib/db"; // Temporarily bypassed

export async function POST(req: Request) {
  try {
    const { email, password, host, port, tls } = await req.json();

    if (!email || !password || !host || !port) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`🌐 Verifying IMAP connection for: ${email}`);

    // 1. Verify connection by trying to fetch recent emails
    try {
      await fetchRecentEmails({
        user: email,
        password,
        host,
        port: parseInt(port),
        tls: tls !== false, // default to true
      }, 1);
      console.log("✅ IMAP Connection verified successfully!");
    } catch (error: any) {
      console.error("❌ IMAP Connection verification failed:", error);
      return NextResponse.json({ error: `Connection failed: ${error.message}` }, { status: 400 });
    }

    // 2. Mock Save (In a real app, save to file-store or DB)
    // Since we are using file-store for settings, we could add accounts there too
    console.log("📝 Mock saving account details...");

    return NextResponse.json({ 
      success: true, 
      account: { emailAddress: email, provider: "imap" } 
    });
  } catch (error: any) {
    console.error("Account connection error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
