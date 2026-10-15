import { NextResponse } from "next/server";
import { seedScenario } from "@/server/seed";
import { DEMO_MODE } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 300;

/** DEMO MODE ONLY: sets up the simulated Guangfu scenario on a fresh deployment. */
export async function POST() {
  if (!DEMO_MODE) return NextResponse.json({ error: "Demo mode is disabled" }, { status: 403 });
  const log: string[] = [];
  try {
    const { fund } = await seedScenario(log);
    return NextResponse.json({ fund, log });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e), log }, { status: 400 });
  }
}
