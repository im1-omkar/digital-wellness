import { NextResponse } from "next/server";
import { feedbackSchema } from "@wellness/contracts";

const apiBase = (process.env.API_INTERNAL_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter a valid feedback note." }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Choose a target and issue type, then enter a note between 5 and 1000 characters." }, { status: 400 });

  try {
    const response = await fetch(`${apiBase}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store"
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Feedback is temporarily unavailable." }, { status: 503 });
  }
}
