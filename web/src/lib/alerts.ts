import type { Snapshot } from "./snapshot";
import { villageName } from "./scenario";

/**
 * Accountability alerts: simple, published rules over public on-chain data. Anyone can recompute
 * them from the open data. They flag where to look; they are not accusations.
 */
export type Alert = { tone: "warn" | "bad" | "info"; rule: string; detail: string };

const DAY = 86400;
export const RULES = {
  ackDays: 14, // a custodian should acknowledge a tranche within two weeks
  heldDays: 90, // money still held, neither forwarded nor reported paid, after three months
  appealDays: 14, // an appeal waiting more than two weeks
  proxyShare: 0.3, // more than 30% of a tranche's confirmations signed by proxies
  proxyMin: 3,
};

const days = (s: number) => Math.floor(s / DAY);
const k = (n: number) => (n > 0 && n < 5 ? "fewer than 5" : String(n));

export function computeAlerts(snap: Snapshot): Alert[] {
  const out: Alert[] = [];
  const now = snap.timestamp;
  const label = (id: number) => `Tranche #${id}`;

  for (const h of snap.hops) {
    if (!h.ackAt && now - h.createdAt > RULES.ackDays * DAY) {
      out.push({ tone: "warn", rule: `Not acknowledged within ${RULES.ackDays} days`, detail: `${label(h.id)}: sent ${days(now - h.createdAt)} days ago, receipt not acknowledged.` });
    }
    const held = h.amount - h.forwarded - h.reconciled;
    if (h.ackAt && held > 0n && now - h.createdAt > RULES.heldDays * DAY) {
      out.push({ tone: "warn", rule: `Held more than ${RULES.heldDays} days`, detail: `${label(h.id)}: NT$${Number(held).toLocaleString("en-US")} neither passed on nor reported paid after ${days(now - h.createdAt)} days.` });
    }
    if (h.disputed > 0) {
      out.push({ tone: "bad", rule: "Households say a payment did not reach them", detail: `${label(h.id)}: ${h.disputed} line(s) disputed by the household or its proxy.` });
    }
    const answered = h.confirmed + h.proxyConfirmed;
    if (h.proxyConfirmed >= RULES.proxyMin && h.proxyConfirmed / answered > RULES.proxyShare) {
      out.push({ tone: "warn", rule: `Over ${RULES.proxyShare * 100}% confirmed by proxies`, detail: `${label(h.id)}: ${h.proxyConfirmed} of ${answered} confirmations signed by a proxy, not the household.` });
    }
    if (h.unregistered > 0) {
      out.push({ tone: "bad", rule: "Roster lists receipts that are not registered households", detail: `${label(h.id)}: ${h.unregistered} published line(s) do not belong to any household verified with two signatures.` });
    }
    const rosterHouseholds = h.reconciledHouseholds - h.programDelivered;
    if (snap.disaster && rosterHouseholds > snap.disaster.verified) {
      out.push({ tone: "bad", rule: "More households paid than verified", detail: `${label(h.id)}: rosters list ${rosterHouseholds} households; only ${snap.disaster.verified} are verified for this disaster.` });
    }
  }

  for (const a of snap.appeals) {
    if (a.status === 1 && now - a.filedAt > RULES.appealDays * DAY) {
      out.push({ tone: "warn", rule: `Appeal waiting over ${RULES.appealDays} days`, detail: `${villageName(a.village)}: appeal #${a.id} filed ${days(now - a.filedAt)} days ago.` });
    }
  }

  for (const s of snap.villageStats) {
    const waiting = Math.max(s.waitingNow, s.waitingLast);
    if (waiting > 0 && (!s.coverageAsOf || s.unserved === 0)) {
      out.push({
        tone: "warn",
        rule: "Households say they are waiting; the township has not reported it",
        detail: `${villageName(s.code)}: ${k(waiting)} verified household(s) reported they are still waiting; the township office ${s.coverageAsOf ? "reported 0 unserved" : "has not reported coverage"}.`,
      });
    }
  }

  for (const p of snap.fund?.proposals ?? []) {
    if (p.status === 5) out.push({ tone: "bad", rule: "Emergency change overturned", detail: `Proposal #${p.id}: households vetoed it on review; the emergency path is revoked.` });
    else if (p.emergency && p.status === 2) out.push({ tone: "info", rule: "Emergency path used", detail: `Proposal #${p.id} applied at once; households review it afterwards.` });
  }
  return out;
}
