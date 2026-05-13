import path from 'path';
import dotenv from 'dotenv';
// Load .env BEFORE anything else!
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import OpenAI from 'openai';
import { prisma } from '../lib/db';

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set in .env");
  return new OpenAI({ apiKey });
};

async function startProcessor() {
  console.log("🧠 Starting AI Processing Engine...");

  let openai: OpenAI;
  try {
    openai = getOpenAI();
  } catch (err: any) {
    console.error("❌ Cannot start AI Processor:", err.message);
    return;
  }

  // Polling loop
  setInterval(async () => {
    try {
      // Find emails that haven't been analysed yet
      const unprocessed = await prisma.email.findMany({
        where: { status: 'new' },
        take: 5 // Process in small batches
      });

      if (unprocessed.length === 0) return;

      console.log(`🤖 Found ${unprocessed.length} new emails. Analyzing...`);

      for (const email of unprocessed) {
        await processEmail(openai, email);
      }
    } catch (err: any) {
      console.error("❌ Error in AI processor loop:", err.message);
    }
  }, 10000); // Check every 10 seconds
}

async function processEmail(openai: OpenAI, email: any) {
  try {
    console.log(`🔍 Analyzing: "${email.subject}"`);

    // Prepare prompt
    const prompt = `
You are MailMind, an autonomous email assistant. 
Please analyze the following email and return a JSON object with the following structure:
{
  "priority": number (1 = Urgent, 2 = Normal, 3 = Low/Noise),
  "priorityReason": string (brief reason for the priority),
  "summary": string (1-2 sentence summary of the email),
  "intent": string (What does the sender want?),
  "recommendedAction": string (What should the user do?),
  "draftReply": string (A professional draft response, if applicable. Otherwise null),
  "confidenceScore": number (0.0 to 1.0, how confident you are in this analysis)
}

Email details:
From: ${email.from}
Subject: ${email.subject}
Body:
${email.bodyText?.substring(0, 2000) || "No content"}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for speed/cost, can be upgraded
      messages: [
        { role: "system", content: "You are a helpful, JSON-outputting email assistant." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content returned from OpenAI");

    const analysisResult = JSON.parse(content);

    // Save Analysis
    await prisma.emailAnalysis.create({
      data: {
        emailId: email.id,
        priority: analysisResult.priority,
        priorityReason: analysisResult.priorityReason,
        summary: analysisResult.summary,
        intent: analysisResult.intent,
        recommendedAction: analysisResult.recommendedAction,
        confidenceScore: analysisResult.confidenceScore
      }
    });

    if (analysisResult.draftReply) {
      await prisma.emailDraft.create({
        data: {
          emailId: email.id,
          originalAiDraft: analysisResult.draftReply,
          draftBody: analysisResult.draftReply,
          aiConfidence: analysisResult.confidenceScore,
          status: "pending"
        }
      });
    }

    // Determine new status based on confidence (simplified logic for now)
    // In a real app, this would evaluate AutomationRule table.
    let newStatus = "draft_ready"; // Default puts it in Review Needed or Inbox
    if (analysisResult.confidenceScore > 0.9 && analysisResult.priority === 3) {
      // Highly confident noise -> auto archive
      newStatus = "archived";
    }

    // Update Email status
    await prisma.email.update({
      where: { id: email.id },
      data: { status: newStatus }
    });

    console.log(`✅ Successfully analysed: "${email.subject}" -> Priority: ${analysisResult.priority}`);

  } catch (err: any) {
    console.error(`❌ Failed to process email ${email.id}:`, err.message);
  }
}

// Handle shutdown
process.on('SIGINT', async () => {
  console.log("Shutting down AI Processor...");
  await prisma.$disconnect();
  process.exit(0);
});

startProcessor();
