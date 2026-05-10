import { prisma } from "@/lib/db";
import { fetchRecentEmails } from "./imap";
import { analyzeEmail, draftReply } from "../ai";
import { evaluateRules } from "../automation/engine";
import { emailQueue } from "../queue/client";

export async function syncAccountEmails(accountId: string) {
  const account = await prisma.connectedAccount.findUnique({
    where: { id: accountId },
    include: { user: { include: { styleProfile: true, automationRules: true } } },
  });

  if (!account) throw new Error("Account not found");

  // For IMAP, we use the stored password (in a real app, this would be encrypted)
  const emails = await fetchRecentEmails({
    user: account.emailAddress,
    password: account.accessToken!, // Using accessToken as the password for IMAP
    host: "imap.telstra.com", // Should be stored in DB for each account
    port: 993,
    tls: true,
  }, 20);

  for (const rawEmail of emails) {
    // Check if email already exists
    const existing = await prisma.email.findFirst({
      where: { accountId, subject: rawEmail.subject, receivedAt: rawEmail.date },
    });

    if (existing) continue;

    // 1. Save new email
    const email = await prisma.email.create({
      data: {
        accountId,
        from: rawEmail.from || "Unknown",
        to: rawEmail.to || account.emailAddress,
        subject: rawEmail.subject,
        bodyText: rawEmail.text,
        bodyHtml: rawEmail.html,
        receivedAt: rawEmail.date || new Date(),
        status: "new",
      },
    });

    // 2. Queue for analysis (or do it synchronously for now if small volume)
    await emailQueue.add('analyse-email', { emailId: email.id });
  }

  // Update last synced
  await prisma.connectedAccount.update({
    where: { id: accountId },
    data: { lastSyncedAt: new Date() },
  });
}

export async function processEmailAnalysis(emailId: string) {
  const email = await prisma.email.findUnique({
    where: { id: emailId },
    include: { account: { include: { user: { include: { styleProfile: true, automationRules: true } } } } },
  });

  if (!email) return;

  // 1. Run AI Analysis
  const analysisResult = await analyzeEmail(
    email.bodyText || "",
    email.subject || "",
    email.from
  );

  const analysis = await prisma.emailAnalysis.create({
    data: {
      emailId: email.id,
      emailType: analysisResult.emailType,
      priority: analysisResult.priority,
      priorityReason: analysisResult.priorityReason,
      summary: analysisResult.summary,
      tone: analysisResult.tone,
      intent: analysisResult.intent,
      extractedEntities: analysisResult.extractedEntities as any,
      recommendedAction: analysisResult.recommendedAction,
      shouldAutoReply: analysisResult.shouldAutoReply,
      confidenceScore: analysisResult.confidenceScore,
    },
  });

  // 2. Draft Reply if recommended
  if (analysisResult.recommendedAction === "reply") {
    const userProfile = email.account.user.styleProfile || {
      name: email.account.user.name || "User",
      role: email.account.user.role || "User",
      company: email.account.user.company || "Company",
      tone: "Professional",
      length: "Balanced",
      signOff: "Best regards",
    };

    const draftText = await draftReply(email.bodyText || "", analysisResult, {
      name: userProfile.name,
      role: userProfile.role || "",
      company: userProfile.company || "",
      tone: userProfile.tone || "Professional",
      length: userProfile.lengthPreference || "Balanced",
      signOff: userProfile.signOff || "Best regards",
    });

    await prisma.emailDraft.create({
      data: {
        emailId: email.id,
        draftBody: draftText,
        originalAiDraft: draftText,
        status: "pending",
        aiConfidence: analysisResult.confidenceScore,
      },
    });
  }

  // 3. Evaluate Rules
  const rules = email.account.user.automationRules.map(r => ({
    id: r.id,
    name: r.name,
    triggerConditions: r.triggerConditions,
    actions: r.actions,
    confidenceThreshold: r.confidenceThreshold,
  }));

  const ruleResult = await evaluateRules(email, analysisResult, rules);
  
  // Apply rule actions (e.g., auto-send)
  if (ruleResult.overrideHumanReview && analysisResult.shouldAutoReply) {
    // Logic to auto-send would go here
    console.log(`Auto-sending email ${email.id} based on rules`);
  }

  // 4. Update Email Status
  await prisma.email.update({
    where: { id: email.id },
    data: { status: "analysed" },
  });
}
