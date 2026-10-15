"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Address } from "viem";
import { loadSnapshot, type Snapshot } from "@/lib/snapshot";
import { ROLES, type RoleName } from "@/lib/scenario";
import { CHAIN_ID } from "@/lib/config";

type Ctx = {
  snap: Snapshot | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  roles: Partial<Record<RoleName, Address>>;
  labelOf: (address?: string) => string | null;
};

const SnapshotContext = createContext<Ctx | null>(null);

export function SnapshotProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Partial<Record<RoleName, Address>>>({});
  const inflight = useRef<Promise<void> | null>(null);

  const refresh = useCallback(async () => {
    if (inflight.current) return inflight.current;
    inflight.current = (async () => {
      try {
        setSnap(await loadSnapshot());
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
        inflight.current = null;
      }
    })();
    return inflight.current;
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, CHAIN_ID === 31337 ? 4000 : 10000);
    fetch("/api/roles")
      .then((r) => r.json())
      .then(setRoles)
      .catch(() => {});
    return () => clearInterval(id);
  }, [refresh]);

  const labelOf = useCallback(
    (address?: string) => {
      if (!address) return null;
      const entry = Object.entries(roles).find(([, a]) => a?.toLowerCase() === address.toLowerCase());
      if (entry) return ROLES[entry[0] as RoleName].short;
      if (snap?.fund && address.toLowerCase() === snap.fund.address.toLowerCase()) return "Relief fund";
      return null;
    },
    [roles, snap],
  );

  return (
    <SnapshotContext.Provider value={{ snap, error, loading, refresh, roles, labelOf }}>
      {children}
    </SnapshotContext.Provider>
  );
}

export function useSnapshot() {
  const ctx = useContext(SnapshotContext);
  if (!ctx) throw new Error("useSnapshot outside provider");
  return ctx;
}
