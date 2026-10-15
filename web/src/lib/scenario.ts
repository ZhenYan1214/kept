/**
 * The simulated scenario used by the demo. Place names follow Guangfu Township (光復鄉), Hualien,
 * where the Mataian River barrier lake overflowed on 2025-09-23. All households, amounts and
 * decisions in the demo are SIMULATED; no real person's data is used.
 */

export const TOWNSHIP = { code: 1001, name: "Guangfu Township Office", zh: "光復鄉公所" } as const;

export const VILLAGES = [
  { code: 100101, name: "Datong", zh: "大同村" },
  { code: 100102, name: "Dama", zh: "大馬村" },
  { code: 100103, name: "Nanfu", zh: "南富村" },
  { code: 100104, name: "Dajin", zh: "大進村" },
  { code: 100105, name: "Daquan", zh: "大全村" },
] as const;

export const TIERS = ["Destroyed", "Severely damaged", "Flooded"] as const;

export const PURPOSES = [
  "Livelihood relief",
  "Housing repair",
  "Community & mental-health recovery",
  "Long-term recovery of the affected villages",
] as const;
export const PURPOSE_CAPS = [5500, 2500, 1000, 1000];
/** Index of the charter purpose that alone may receive money after the deadline. */
export const SURPLUS_PURPOSE = 3;

export const DISASTER_NAME = "Mataian River barrier lake, Guangfu 2025 (simulated)";
export const FUND_NAME = "Guangfu Relief Fund (simulated)";
export const SURPLUS_RULE =
  "After the deadline, unspent money may only fund long-term recovery of the villages affected by this disaster. It can never be moved to another disaster, general public works or administrative costs.";

export function villageName(code: number | bigint) {
  const v = VILLAGES.find((v) => v.code === Number(code));
  return v ? `${v.name} (${v.zh})` : `Village ${code}`;
}

export function tierName(tier: number | bigint) {
  return TIERS[Number(tier)] ?? `Tier ${tier}`;
}

/** Demo role directory. Index = HD derivation index of the demo mnemonic. */
export const ROLES = {
  authority: { index: 0, label: "Ministry of Health & Welfare (registry authority)", short: "Authority" },
  office: { index: 1, label: "Guangfu Township Office", short: "Township office" },
  chief0: { index: 2, label: "Village chief — Datong", short: "Chief Datong" },
  chief1: { index: 10, label: "Village chief — Dama", short: "Chief Dama" },
  chief2: { index: 11, label: "Village chief — Nanfu", short: "Chief Nanfu" },
  chief3: { index: 12, label: "Village chief — Dajin", short: "Chief Dajin" },
  chief4: { index: 13, label: "Village chief — Daquan", short: "Chief Daquan" },
  c1: { index: 3, label: "Committee: foundation director", short: "Committee 1" },
  c2: { index: 4, label: "Committee: independent accountant", short: "Committee 2" },
  c3: { index: 5, label: "Committee: community representative", short: "Committee 3" },
  ministry: { index: 6, label: "Ministry (receives pre-allocations)", short: "Ministry" },
  ngo: { index: 7, label: "Partner NGO (on-site distribution)", short: "NGO" },
  donor: { index: 8, label: "Demo donor", short: "Donor" },
  custodian: { index: 9, label: "Disaster Relief Foundation (custodian)", short: "Foundation" },
  county: { index: 14, label: "County government", short: "County" },
  socialWorker: { index: 15, label: "Registered social worker (proxy)", short: "Social worker" },
  relayer: { index: 16, label: "Relayer (pays gas for households)", short: "Relayer" },
} as const;

export type RoleName = keyof typeof ROLES;
