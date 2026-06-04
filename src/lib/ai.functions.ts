import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert professional email writer. Generate a polished email based on the user's brief.
Structure your output as:
Subject: <concise subject line>

<email body with proper greeting, well-organized paragraphs, and a professional sign-off>

Match the requested tone and audience precisely. Be concise, clear, and actionable. Output only the email — no commentary.`,

  meeting: `You are an expert meeting notes summarizer. Given raw meeting notes or a transcript, produce a structured summary in clean Markdown with these sections:

## Summary
A 2-3 sentence executive summary.

## Key Discussion Points
- Bullet list of the most important topics

## Decisions Made
- Bullet list of concrete decisions

## Action Items
- [ ] **Owner** — Task description (Deadline: date or "TBD")

## Deadlines & Next Steps
- Bullet list of upcoming dates and follow-ups

Be concise and faithful to the source. Do not invent details.`,

  tasks: `You are an expert AI task planner using the Eisenhower priority matrix. Given a list of tasks or goals, output a structured plan in Markdown:

## Prioritized Plan

### 🔴 Urgent & Important (Do First)
- Task — *est. time* — rationale

### 🟡 Important, Not Urgent (Schedule)
- Task — *est. time* — suggested time block

### 🟢 Urgent, Not Important (Delegate)
- Task — who or how to delegate

### ⚪ Neither (Eliminate or Defer)
- Task — reason

## Suggested Schedule (Today)
A simple morning/afternoon/evening time-block plan.

Be realistic about time estimates and dependencies.`,

  research: `You are an expert research assistant. Given a topic or question, produce a structured research brief in Markdown:

## TL;DR
2-3 sentence executive answer.

## Key Insights
- 4-6 substantive bullet points with concrete facts and context

## Background
A short paragraph providing context.

## Different Perspectives
- Bullet list of viewpoints, trade-offs, or debates

## Suggested Next Steps
- What to read, explore, or ask next

Be accurate, balanced, and clearly flag uncertainty. Do not fabricate sources.`,

  chat: `You are a helpful, professional AI assistant for workplace productivity. Provide clear, concise, well-formatted answers in Markdown. Be friendly but efficient.`,
};

export const runAi = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      feature: z.enum(["email", "meeting", "tasks", "research", "chat"]),
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1).max(20000),
          }),
        )
        .min(1)
        .max(50),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured." };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[data.feature] },
          ...data.messages,
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) {
        return { ok: false as const, error: "Rate limit reached. Please try again shortly." };
      }
      if (res.status === 402) {
        return { ok: false as const, error: "AI credits exhausted. Please add credits to your workspace." };
      }
      const text = await res.text();
      console.error("AI gateway error", res.status, text);
      return { ok: false as const, error: "AI request failed. Please try again." };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return { ok: true as const, content };
  });