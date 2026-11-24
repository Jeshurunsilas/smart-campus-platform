import { NextRequest, NextResponse } from "next/server";
import { processAICopilotQuery } from "@/lib/services/ai-copilot";
import { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, role = "student", userId = "usr-01", userName = "Campus User", userEmail = "user@smartcampus.demo" } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt string is required." }, { status: 400 });
    }

    const result = await processAICopilotQuery(prompt, {
      role: role as UserRole,
      userId,
      userName,
      userEmail,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to process AI copilot query.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
