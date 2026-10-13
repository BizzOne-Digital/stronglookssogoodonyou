import { NextResponse } from "next/server";

/** Liveness check for hosting (no secrets exposed). */
export async function GET() {
  const ready =
    Boolean(process.env.MONGODB_URI) && Boolean(process.env.AUTH_SECRET);

  return NextResponse.json(
    { status: ready ? "ok" : "degraded" },
    { status: ready ? 200 : 503 }
  );
}
