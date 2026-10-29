"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "./ui";
import { useSnapshot } from "./snapshot";
import { Icon, KeptMark } from "./icons";
import { CHAIN_ID } from "@/lib/config";
import { DemoProgressProvider, GuideBar, GuideSteps } from "./demo-guide";

/** The roles anyone can play in the demo; each is a page that writes to the testnet. */
export const ROLE_LINKS = [
  { href: "/household", label: "Household", what: "Hold a credential, confirm or dispute a payment", icon: Icon.House },
  { href: "/issuer", label: "Village & township", what: "Two signatures for every household", icon: Icon.Seal },
  { href: "/custody", label: "Custodians", what: "Acknowledge, pass on, publish payment lines", icon: Icon.Handoff },
  { href: "/committee", label: "Fund committee", what: "Decide, under a charter households can veto", icon: Icon.People },
  { href: "/ngo", label: "NGO counter", what: "Check eligibility without the roster", icon: Icon.Shield },
];

const FUND_LINKS = [
  { href: "/dashboard", label: "Overview", icon: Icon.Ledger },
  { href: "/dashboard#alerts", label: "Alerts", icon: Icon.Alert },
  { href: "/dashboard#custody", label: "Where the money is", icon: Icon.Handoff },
  { href: "/dashboard#audits", label: "Sample audits", icon: Icon.Sample },
  { href: "/dashboard#changes", label: "Charter and votes", icon: Icon.Ballot },
];

const chainName = CHAIN_ID === 31337 ? "Local devnet" : CHAIN_ID === 84532 ? "Base Sepolia" : `Chain ${CHAIN_ID}`;

function Sidebar() {
  const { snap } = useSnapshot();
  return (
    <div className="flex flex-col gap-8">
      <GuideSteps />
      <nav aria-label="This fund" className="flex flex-col gap-0.5">
        <p className="px-2.5 pb-2 text-xs font-semibold text-muted">This fund</p>
        {FUND_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-sunk/70 hover:text-ink"
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        ))}
        <Link
          href="/replay"
          className="mt-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-sunk/70 hover:text-ink"
        >
          <Icon.Flag className="h-4 w-4" />
          Guangfu, real data
        </Link>
        <Link
          href="/setup"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-sunk/70 hover:text-ink"
        >
          <Icon.Settings className="h-4 w-4" />
          Start a fresh scenario
        </Link>
      </nav>
      {snap && <p className="px-2.5 text-xs text-muted">Block {snap.block.toLocaleString("en-US")}</p>}
    </div>
  );
}

/** The demo app: who you are acting as on top, the guided path and the fund on the left, the work in the middle. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { snap, error } = useSnapshot();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);
  const role = ROLE_LINKS.find((r) => r.href === path);

  return (
    <DemoProgressProvider>
      <div className="min-h-dvh">
        <header className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur-md">
          <div className="flex h-[60px] items-center gap-3 px-4 sm:px-5">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label="Demo menu"
            >
              {menu ? <Icon.Cross className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2 text-ink" aria-label="Kept, home">
              <KeptMark className="h-6 w-6" seal={false} plain />
              <span className="font-bold">Kept</span>
            </Link>
            <span className="hidden text-line sm:inline" aria-hidden>
              /
            </span>
            <span className="hidden truncate text-[15px] font-medium text-ink sm:inline">{snap?.fund?.name ?? "Demo fund"}</span>
            <span className="hidden rounded-md border border-line px-1.5 py-0.5 text-xs text-muted md:inline">Simulated</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-[13px] text-muted md:inline-flex" title={error ?? undefined}>
                <span className={cx("h-[7px] w-[7px] rounded-full", error ? "bg-bad" : "ping bg-ok")} />
                {chainName}
              </span>
              <label className="flex items-center gap-2 text-sm text-muted">
                <span className="hidden sm:inline">Acting as</span>
                <select
                  value={role?.href ?? ""}
                  onChange={(e) => e.target.value && router.push(e.target.value)}
                  className="h-9 rounded-lg border border-line bg-card px-2.5 text-sm font-semibold text-ink"
                >
                  <option value="">Observer (public)</option>
                  {ROLE_LINKS.map((r) => (
                    <option key={r.href} value={r.href}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          {error && (
            <p className="border-t border-bad/20 bg-bad/5 px-5 py-1.5 text-xs text-bad">Could not read the chain: {error.slice(0, 120)}</p>
          )}
        </header>

        <div className="flex">
          <aside className="sticky top-[60px] hidden h-[calc(100dvh-60px)] w-[248px] shrink-0 overflow-y-auto border-r border-line px-3 py-6 lg:block">
            <Sidebar />
          </aside>
          {menu && (
            <div className="drop fixed inset-x-0 top-[60px] z-20 max-h-[calc(100dvh-60px)] overflow-y-auto border-b border-line bg-paper px-3 py-5 shadow-lg lg:hidden">
              <Sidebar />
            </div>
          )}
          <main className="min-w-0 flex-1 px-4 pb-20 pt-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">
              <GuideBar />
              {children}
            </div>
          </main>
        </div>
      </div>
    </DemoProgressProvider>
  );
}
