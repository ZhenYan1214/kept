import { NextResponse } from "next/server";
import { roleAccount } from "@/server/roles";
import { ROLES, type RoleName } from "@/lib/scenario";

export const runtime = "nodejs";

/** Public directory of demo institution addresses (addresses only, never keys). */
export async function GET() {
  const out: Record<string, string> = {};
  for (const role of Object.keys(ROLES) as RoleName[]) out[role] = roleAccount(role).address;
  return NextResponse.json(out);
}
