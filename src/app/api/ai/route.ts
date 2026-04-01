import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

function fallback(query: string) {
  return "Basic advice: Stay hydrated, rest well, and consult a doctor.\n\n*(Fallback due to AI limit)*";
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"), // ✅ FIXED
        system: `You are CareBot+, a medical assistant.
- Keep answers medium/shortly
- Suggest general medicine only
- Always advise doctor consultation`,
        prompt: query,
      });

      return NextResponse.json({ result: text });

    } catch (err: any) {
      console.error("AI Error:", err?.message);
      return NextResponse.json({ result: fallback(query) });
    }

  } catch (error) {
    return NextResponse.json(
      { result: "Server error" },
      { status: 500 }
    );
  }
}