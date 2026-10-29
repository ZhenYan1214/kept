"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "./ui";
import { Icon, KeptMark } from "./icons";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/replay", label: "The Guangfu case" },
  { href: "/why", label: "Why Kept" },
  { href: "/#faq", label: "FAQ" },
];

/** The public site's header: a few links and one action. */
export function SiteNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-paper/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="Kept, home">
          <KeptMark className="h-7 w-7" seal={false} plain />
          <span className="text-[19px] font-bold tracking-tight">Kept</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href ? "page" : undefined}
              className={cx("transition-colors hover:text-ink", path === l.href ? "font-medium text-ink" : "text-muted")}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-5 md:flex">
          <a href="https://github.com/ZhenYan1214/kept" className="text-[15px] text-muted transition-colors hover:text-ink">
            GitHub
          </a>
          <Link href="/household" className="rounded-[9px] bg-accent px-4 py-2.5 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90">
            Try the demo
          </Link>
        </div>
        <button
          type="button"
          className="ml-auto grid h-11 w-11 place-items-center rounded-lg text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Menu"
        >
          {open ? <Icon.Cross className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
        </button>
        {open && (
          <div className="drop absolute inset-x-0 top-full border-b border-line bg-paper px-4 pb-6 pt-2 shadow-lg md:hidden">
            <ul className="grid gap-0.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block rounded-lg px-3 py-3 text-base text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://github.com/ZhenYan1214/kept" className="block rounded-lg px-3 py-3 text-base text-ink">
                  GitHub
                </a>
              </li>
            </ul>
            <Link href="/household" className="mt-3 block rounded-[10px] bg-accent px-4 py-3.5 text-center font-semibold text-on-accent">
              Try the demo
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-10 px-4 py-12 sm:px-6">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 text-ink">
            <KeptMark className="h-6 w-6" seal={false} plain />
            <span className="font-bold">Kept</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Disaster-relief promises you can verify. Names, IDs and bank accounts never go on-chain. Open source, MIT licence.
          </p>
        </div>
        <div className="flex flex-wrap gap-16 text-sm">
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-ink">Product</span>
            <Link href="/dashboard" className="text-muted hover:text-ink">
              Demo
            </Link>
            <Link href="/replay" className="text-muted hover:text-ink">
              Guangfu, real data
            </Link>
            <Link href="/why" className="text-muted hover:text-ink">
              Why Kept
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-ink">Project</span>
            <a href="https://github.com/ZhenYan1214/kept" className="text-muted hover:text-ink">
              Source code
            </a>
            <a href="https://github.com/ZhenYan1214/kept/blob/main/docs/security-review.md" className="text-muted hover:text-ink">
              Security review
            </a>
            <a href="https://github.com/ZhenYan1214/kept/blob/main/docs/policy/ordinance-summary-en.md" className="text-muted hover:text-ink">
              Draft ordinance
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-4 pb-10 text-xs text-muted sm:px-6">Built for the Web3 for Social Good Hackathon 2026.</div>
    </footer>
  );
}
