import { NextResponse } from "next/server";
import { logSession } from "@/lib/db/supabase";
import type { SessionLog } from "@/lib/types/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SessionLog;

    if (!body.sessionId?.trim() || !body.userId?.trim()) {
      return NextResponse.json(
        { error: "sessionId and userId are required" },
        { status: 400 }
      );
    }

    await logSession(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/log]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
