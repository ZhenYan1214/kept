"use client";
import { useState } from "react";
import { useSnapshot } from "@/components/snapshot";
import { ActionButton, Card, Note, SectionTitle } from "@/components/ui";
import { postJSON } from "@/lib/api";
import { CHAIN_ID, getDeployment } from "@/lib/config";
import { clearCard } from "@/lib/household";

export default function Setup() {
  const { snap } = useSnapshot();
  const [log, setLog] = useState<string[]>([]);
  const d = getDeployment();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <SectionTitle kicker="Demo" title="Set up the simulated scenario">
          Creates the disaster, villages and issuers, a fund from the template, donations, 20 simulated households, appeals and a
          partly delivered custody chain — the starting point of the demo.
        </SectionTitle>
        {snap?.seeded ? (
          <Note tone="ok">Scenario is set up on this deployment.</Note>
        ) : (
          <ActionButton onClick={async () => setLog((await postJSON<{ log: string[] }>("/api/seed")).log)}>
            Set up scenario
          </ActionButton>
        )}
        {log.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
            {log.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionTitle kicker="Time" title="Waiting periods">
          {CHAIN_ID === 31337
            ? "On the local devnet the real 7-day waiting period is used; fast-forward chain time to continue the demo."
            : "On the testnet the demo fund uses a short waiting period so the flow can be shown live."}
        </SectionTitle>
        {CHAIN_ID === 31337 && (
          <div className="flex flex-wrap gap-2">
            <ActionButton variant="secondary" onClick={() => postJSON("/api/dev/time", { seconds: 86400 })}>
              +1 day
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => postJSON("/api/dev/time", { seconds: 7 * 86400 })}>
              +7 days
            </ActionButton>
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle title="This browser" />
        <p className="mb-3 text-sm text-muted">
          The household credential and the demo &quot;QR inbox&quot; are stored only in this browser.
        </p>
        <ActionButton
          variant="secondary"
          onClick={async () => {
            clearCard();
            localStorage.removeItem("kept.inbox");
            localStorage.removeItem("kept.township-roster");
          }}
        >
          Reset local demo data
        </ActionButton>
      </Card>

      <Card>
        <SectionTitle title="Contracts" />
        <dl className="space-y-1 font-mono text-xs">
          {Object.entries(d)
            .filter(([k]) => !["chainId", "deployBlock"].includes(k))
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="min-w-0 truncate">{String(v)}</dd>
              </div>
            ))}
        </dl>
      </Card>
    </div>
  );
}
