import OpenAI from "openai";
import { prisma } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmailAnalysisResult {
  emailType: string;
  priority: number;
  priorityReason: string;
  summary: string[];
  tone: string;
  intent: string;
  extractedEntities: {
    actionItems: string[];
    questions: string[];
    deadlines: string[];
    names: string[];
    companies: string[];
  };
  recommendedAction: "reply" | "forward" | "archive" | "flag" | "none";
  shouldAutoReply: boolean;
  confidenceScore: number;
}

export async function analyzeEmail(emailContent: string, subject: string, from: string): Promise<EmailAnalysisResult> {
  const prompt = `
    You are an expert email analyst. Your job is to analyse incoming emails and return a structured JSON response.
    
    Email Subject: ${subject}
    From: ${from}
    Content: ${emailContent}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
          You are an expert email analyst. Your job is to analyse incoming emails and return a structured JSON response.
          For each email provided, return ONLY valid JSON with this exact structure:
          {
            "emailType": string,
            "priority": number (1-10),
            "priorityReason": string,
            "summary": string[],
            "tone": string,
            "intent": string,
            "extractedEntities": {
              "actionItems": string[],
              "questions": string[],
              "deadlines": string[],
              "names": string[],
              "companies": string[]
            },
            "recommendedAction": "reply" | "forward" | "archive" | "flag" | "none",
            "shouldAutoReply": boolean,
            "confidenceScore": number (0-1)
          }
        `,
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result as EmailAnalysisResult;
}

export async function draftReply(
  originalEmail: string,
  analysis: EmailAnalysisResult,
  userProfile: {
    name: string;
    role: string;
    company: string;
    tone: string;
    length: string;
    signOff: string;
  }
): Promise<string> {
  const systemPrompt = `
    You are an expert email ghostwriter. You write replies on behalf of ${userProfile.name}, who works as ${userProfile.role} at ${userProfile.company}.

    Communication style profile:
    - Tone: ${userProfile.tone}
    - Length preference: ${userProfile.length}
    - Sign-off: ${userProfile.signOff}

    Write a reply that:
    1. Addresses EVERY question and request in the latest email
    2. Is written in ${userProfile.name}'s voice
    3. Is ${userProfile.length} in length
    4. Ends with the exact sign-off specified

    Return ONLY the email body text. No subject line. No explanation. Just the reply.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Original Email Content: ${originalEmail}\n\nAI Analysis Summary: ${analysis.summary.join(", ")}` },
    ],
  });

  return response.choices[0].message.content || "";
}
