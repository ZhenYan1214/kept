import { NextResponse } from "next/server";
import { publicClient } from "@/server/roles";
import { CHAIN_ID } from "@/lib/config";

export const runtime = "nodejs";

/** LOCAL DEVNET ONLY: fast-forward chain time (e.g. to the end of a 7-day waiting period). */
export async function POST(req: Request) {
  if (CHAIN_ID !== 31337) return NextResponse.json({ error: "Only available on the local devnet" }, { status: 403 });
  const { seconds } = (await req.json()) as { seconds: number };
  await publicClient.request({ method: "evm_increaseTime" as never, params: [Number(seconds)] as never });
  await publicClient.request({ method: "evm_mine" as never, params: [] as never });
  return NextResponse.json({ ok: true });
}
