import path from 'path';
import dotenv from 'dotenv';
// Load .env BEFORE anything else!
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import imaps from 'imap-simple';
import { simpleParser, ParsedMail } from 'mailparser';
import { decryptPassword } from '../lib/encryption';
import { prisma } from '../lib/db';

async function startListener() {
  console.log("🚀 Starting IMAP Listener Engine...");

  // 1. Fetch active IMAP accounts
  const accounts = await prisma.connectedAccount.findMany({
    where: { isActive: true, provider: 'imap' }
  });

  if (accounts.length === 0) {
    console.log("ℹ️ No active IMAP accounts found. Exiting listener.");
    return;
  }

  for (const account of accounts) {
    if (!account.accessToken) continue;

    const emailParts = account.emailAddress.split('@');
    if (emailParts.length !== 2) continue;
    const domain = emailParts[1];

    // Simple heuristic for IMAP host, should really be stored in DB but we'll infer it or default for Bigpond
    let host = `imap.${domain}`;
    if (domain === 'bigpond.com') host = 'imap.telstra.com';

    try {
      const password = decryptPassword(account.accessToken);
      
      const config = {
        imap: {
          user: account.emailAddress,
          password: password,
          host: host,
          port: 993,
          tls: true,
          tlsOptions: { rejectUnauthorized: false }, // Useful for local/testing
          authTimeout: 10000
        }
      };

      console.log(`📡 Connecting to IMAP for ${account.emailAddress} at ${host}...`);
      
      const connection = await imaps.connect(config);
      await connection.openBox('INBOX');
      console.log(`✅ Connected and listening to INBOX for ${account.emailAddress}`);

      // Initial Fetch (last 24 hours just to seed)
      const delay = 24 * 3600 * 1000;
      const yesterday = new Date(Date.now() - delay).toISOString();
      const searchCriteria = ['UNSEEN', ['SINCE', yesterday]];
      const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], struct: true, markSeen: false };

      const messages = await connection.search(searchCriteria, fetchOptions);
      console.log(`📥 Found ${messages.length} unseen messages initially.`);

      for (const msg of messages) {
        await processMessage(msg, account.id, connection);
      }

      // 2. Listen for new mail using IDLE
      connection.on('mail', async (numNewMail: number) => {
        console.log(`🔔 New mail alert: ${numNewMail} new message(s) for ${account.emailAddress}`);
        
        // Fetch the unseen messages again
        const newSearch = ['UNSEEN'];
        const newMessages = await connection.search(newSearch, fetchOptions);
        
        for (const msg of newMessages) {
          await processMessage(msg, account.id, connection);
        }
      });

    } catch (err: any) {
      console.error(`❌ Failed to start listener for ${account.emailAddress}:`, err.message);
    }
  }
}

async function processMessage(msg: any, accountId: string, connection: any) {
  try {
    const all = msg.parts.find((part: any) => part.which === '');
    if (!all) return;

    // Check if we already processed this message (using messageId)
    const headerPart = msg.parts.find((part: any) => part.which === 'HEADER');
    const messageId = headerPart?.body?.['message-id']?.[0] || String(msg.attributes.uid);

    const existing = await prisma.email.findFirst({
      where: { accountId, gmailMessageId: messageId }
    });

    if (existing) {
      return; // Already imported
    }

    const parsed: ParsedMail = await simpleParser(all.body);
    
    // Save to DB
    await prisma.email.create({
      data: {
        accountId,
        gmailMessageId: messageId,
        from: parsed.from?.text || "Unknown Sender",
        to: Array.isArray(parsed.to) ? parsed.to.map(t => t.text).join(', ') : parsed.to?.text || "",
        subject: parsed.subject || "No Subject",
        bodyText: parsed.text || "",
        bodyHtml: parsed.html || parsed.textAsHtml || "",
        receivedAt: parsed.date || new Date(),
        status: "new", // Triggers AI Processor
        isRead: false
      }
    });

    console.log(`💾 Saved new email to DB: "${parsed.subject}" from ${parsed.from?.text}`);

    // Optional: Mark as read on the IMAP server so we don't fetch it again
    // await connection.addFlags(msg.attributes.uid, ['\\Seen']);

  } catch (err: any) {
    console.error("Error processing message:", err.message);
  }
}

// Handle shutdown
process.on('SIGINT', async () => {
  console.log("Shutting down IMAP listener...");
  await prisma.$disconnect();
  process.exit(0);
});

startListener();
