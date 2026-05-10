import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AutomationRule {
  id: string;
  name: string;
  triggerConditions: any;
  actions: any;
  confidenceThreshold: number;
}

export async function evaluateRules(email: any, analysis: any, rules: AutomationRule[]) {
  if (rules.length === 0) return { matchedRules: [], recommendedActions: [], overrideHumanReview: false };

  const prompt = `
    You are an automation rules evaluator. Given an email and a list of user-defined rules, determine which rules apply and what actions to take.

    Email Content: ${email.bodyText?.substring(0, 1000)}
    Email Analysis: ${JSON.stringify(analysis)}
    User Rules: ${JSON.stringify(rules)}

    Return ONLY valid JSON with this exact structure:
    {
      "matchedRules": string[],
      "recommendedActions": string[],
      "overrideHumanReview": boolean,
      "reasoning": string
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert automation engine. Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Rules evaluation error:", error);
    return { matchedRules: [], recommendedActions: [], overrideHumanReview: false };
  }
}
