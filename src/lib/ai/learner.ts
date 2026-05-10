import OpenAI from "openai";
import { prisma } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function learnFromEdits(
  originalDraft: string,
  userEditedDraft: string,
  feedback: "good" | "bad" | "edited"
) {
  const prompt = `
    You are an AI trainer that analyses email communication patterns to build a user's style profile.

    Original AI Draft:
    "${originalDraft}"

    User's Final Version:
    "${userEditedDraft}"

    User Feedback: ${feedback}

    Your job is to identify patterns and return a JSON object of learned preferences. Focus on what changed: tone, vocabulary, length, structure, greetings, and closings.

    Return JSON:
    {
      "toneAdjustments": string[],
      "lengthPreference": string,
      "vocabularyPreferences": { "prefer": string[], "avoid": string[] },
      "structurePreferences": string[],
      "greetingPatterns": string[],
      "closingPatterns": string[],
      "topicSpecificRules": object,
      "confidenceScore": number (0-1)
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert style analysis agent. Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Style learning error:", error);
    return null;
  }
}

export async function updateStyleProfile(userId: string, learnedPrefs: any) {
  const profile = await prisma.userStyleProfile.findUnique({
    where: { userId },
  });

  if (!profile) return;

  // Merge learned preferences into the profile
  // In a real app, this would involve weighted averaging of confidence scores
  await prisma.userStyleProfile.update({
    where: { userId },
    data: {
      tone: learnedPrefs.toneAdjustments?.[0] || profile.tone,
      lengthPreference: learnedPrefs.lengthPreference || profile.lengthPreference,
      preferredPhrases: {
        push: learnedPrefs.vocabularyPreferences?.prefer || [],
      },
      avoidedPhrases: {
        push: learnedPrefs.vocabularyPreferences?.avoid || [],
      },
      confidenceScore: (profile.confidenceScore + (learnedPrefs.confidenceScore || 0)) / 2,
    },
  });
}
