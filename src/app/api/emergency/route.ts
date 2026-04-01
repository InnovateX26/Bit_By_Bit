import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

const schema = z.object({
  severity: z.enum(["critical", "high", "moderate"]),
  immediate_actions: z.array(z.string()),
  tell_emergency: z.string(),
  warning_signs: z.array(z.string()),
});

function fallback(symptom: string) {
  return {
    severity: "critical",
    immediate_actions: [
      "Ensure safety",
      "Check breathing",
      "Call emergency services (112)",
    ],
    tell_emergency: `Patient has ${symptom}. Need urgent help.`,
    warning_signs: ["Unconsciousness", "Breathing issue", "Chest pain"],
  };
}

export async function POST(req: Request) {
  try {
    const { symptom } = await req.json();

    if (!symptom) {
      return new Response(JSON.stringify({ error: "Symptom required" }), {
        status: 400,
      });
    }

    try {
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"), // ✅ FIXED
        schema,
        system: `You are an emergency assistant.
- Always prioritize safety
- Recommend calling 112
- Give short actionable steps`,
        prompt: symptom,
      });

      return new Response(JSON.stringify(object), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (err: any) {
      console.error("AI Error:", err?.message);

      return new Response(JSON.stringify(fallback(symptom)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}