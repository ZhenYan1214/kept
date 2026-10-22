import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { SnapshotProvider } from "@/components/snapshot";
import { Nav } from "@/components/nav";
import { KeptMark } from "@/components/icons";

const sans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Kept — disaster-relief promises you can verify",
  description:
    "Kept makes a disaster fund's two promises verifiable: to donors on how the money is used, and to affected households that no one is left out.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#111418" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} min-h-dvh antialiased`}>
        <SnapshotProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">{children}</main>
          <footer className="border-t border-line">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-ink">
                  <KeptMark className="h-7 w-7" />
                  <span className="text-xl font-semibold">Kept</span>
                </div>
                <p className="max-w-sm text-muted">
                  Disaster-relief promises you can verify, past the first hand. Personal data never goes on-chain: only commitments,
                  hashes and pseudonymous receipt addresses.
                </p>
              </div>
              <div>
                <p className="eyebrow mb-3">Evidence</p>
                <ul className="space-y-2">
                  <li>
                    <Link className="text-ink hover:text-accent" href="/replay">
                      Guangfu 2025, real data
                    </Link>
                  </li>
                  <li>
                    <Link className="text-ink hover:text-accent" href="/why">
                      Why Kept, and what it would catch
                    </Link>
                  </li>
                  <li>
                    <a className="text-ink hover:text-accent" href="https://github.com/ZhenYan1214/kept/blob/main/docs/security-review.md">
                      Security review
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-3">Project</p>
                <ul className="space-y-2">
                  <li>
                    <a className="text-ink hover:text-accent" href="https://github.com/ZhenYan1214/kept">
                      Source code (MIT)
                    </a>
                  </li>
                  <li className="text-muted">Web3 for Social Good Hackathon 2026</li>
                </ul>
              </div>
            </div>
          </footer>
        </SnapshotProvider>
      </body>
    </html>
  );
}
