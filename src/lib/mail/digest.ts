import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDailyDigest(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await prisma.email.groupBy({
    by: ['status'],
    where: {
      accountId: { in: (await prisma.connectedAccount.findMany({ where: { userId }, select: { id: true } })).map(a => a.id) },
      receivedAt: { gte: today },
    },
    _count: true,
  });

  const highPriorityEmails = await prisma.email.findMany({
    where: {
      accountId: { in: (await prisma.connectedAccount.findMany({ where: { userId }, select: { id: true } })).map(a => a.id) },
      receivedAt: { gte: today },
      analysis: { priority: { gte: 8 } },
    },
    include: { analysis: true },
    take: 3,
  });

  const prompt = `
    Summarise the daily email activity for a user:
    - Total emails: ${stats.reduce((acc, curr) => acc + curr._count, 0)}
    - Status breakdown: ${JSON.stringify(stats)}
    - High priority items: ${highPriorityEmails.map(e => e.subject).join(", ")}

    Return a 3-sentence summary for a daily digest email.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      summary: response.choices[0].message.content,
      stats,
      highPriorityEmails,
    };
  } catch (error) {
    console.error("Digest generation error:", error);
    return null;
  }
}
