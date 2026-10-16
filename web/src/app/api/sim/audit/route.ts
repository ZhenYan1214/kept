import { NextResponse } from "next/server";
import { ensureRoleGas } from "@/server/roles";
import { auditVisits, drawAudit } from "@/server/seed";
import { DEMO_MODE } from "@/lib/config";
import { fromJSONSafe } from "@/lib/serialize";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * DEMO ONLY. "draw": draw a batch's audit sample (anyone may; the relayer pays gas). "visit": the
 * independent auditor visits the sampled households; each simulated household signs the visit with its
 * own receipt key, and lines of live demo users are left for them to sign on the Household screen.
 */
export async function POST(req: Request) {
  if (!DEMO_MODE) return NextResponse.json({ error: "Demo mode is disabled" }, { status: 403 });
  const { hopId, batchIndex, action } = fromJSONSafe(await req.json()) as { hopId: number; batchIndex: number; action: "draw" | "visit" };
  try {
    if (action === "draw") {
      await ensureRoleGas("relayer");
      await drawAudit(BigInt(hopId), BigInt(batchIndex));
      return NextResponse.json({ ok: true });
    }
    await ensureRoleGas("auditor");
    return NextResponse.json(await auditVisits(BigInt(hopId), BigInt(batchIndex)));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
