import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail/smtp";
import { fetchRecentEmails } from "@/lib/mail/imap";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, host, port } = data;
    
    console.log("🧪 Starting Full Roundtrip Diagnostics...");
    console.log(`📧 Target Email: ${email}`);
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password are required for testing." }, { status: 400 });
    }

    const testId = Math.random().toString(36).substring(7).toUpperCase();
    const testSubject = `MailMind Connection Test [${testId}]`;
    const testBody = `This is an automated test from MailMind to verify your connection settings. \n\nTest ID: ${testId}`;

    // 1. Test SMTP (Send)
    try {
      console.log("📤 Step 1: Sending test email via SMTP...");
      await sendEmail({
        user: email,
        password: password,
        host: "smtp.telstra.com", 
        port: 465,
        secure: true,
      }, {
        to: email,
        subject: testSubject,
        text: testBody
      });
    } catch (error: any) {
      console.error("SMTP Test Failed:", error);
      return NextResponse.json({ 
        error: `SMTP (Send) Failed: ${error.message}`,
        details: "Check if your email/password is correct and if Bigpond allows SMTP access." 
      }, { status: 400 });
    }

    // 2. Wait for email to arrive (10 seconds - more conservative)
    console.log("⏳ Step 2: Waiting 10 seconds for email delivery...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 3. Test IMAP (Receive)
    try {
      console.log("📥 Step 3: Searching for test email via IMAP...");
      const emails = await fetchRecentEmails({
        user: email,
        password: password,
        host: host || "imap.telstra.com",
        port: parseInt(port) || 993,
        tls: true,
      }, 10);

      const found = emails.some(e => e.subject?.includes(testId));
      
      if (!found) {
        console.warn("⚠️ Test email sent but not found in Inbox yet.");
        return NextResponse.json({ 
          error: "Email sent successfully, but could not be found in your Inbox yet.",
          details: "SMTP succeeded! But IMAP search couldn't find the test ID. Your Inbox might be slow, or IMAP host is wrong."
        }, { status: 400 });
      }

      console.log("✅ Diagnostics Complete: Send & Receive Verified!");
    } catch (error: any) {
      console.error("IMAP Test Failed:", error);
      return NextResponse.json({ 
        error: `IMAP (Receive) Failed: ${error.message}`,
        details: "SMTP worked, but IMAP failed. Check your IMAP server settings."
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Roundtrip test error:", error);
    return NextResponse.json({ error: "Internal server error during test" }, { status: 500 });
  }
}
