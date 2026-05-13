import { NextResponse } from "next/server";
import { fetchRecentEmails } from "@/lib/mail/imap";
import { prisma } from "@/lib/db";
import { encryptPassword } from "@/lib/encryption";

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

    // 2. Encrypt password and save to database
    console.log("📝 Saving encrypted account details to database...");
    
    // In a real app we'd have proper user authentication, 
    // here we use a dummy user or fetch the first user.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "localuser@mailmind.local", name: "Local User" }
      });
    }

    const encryptedPassword = encryptPassword(password);

    const account = await prisma.connectedAccount.upsert({
      where: {
        userId_emailAddress: {
          userId: user.id,
          emailAddress: email
        }
      },
      update: {
        accessToken: encryptedPassword,
        provider: "imap",
        isActive: true
      },
      create: {
        userId: user.id,
        provider: "imap",
        emailAddress: email,
        accessToken: encryptedPassword,
        isActive: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      account: { emailAddress: account.emailAddress, provider: account.provider } 
    });
  } catch (error: any) {
    console.error("Account connection error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

