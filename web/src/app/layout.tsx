import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SnapshotProvider } from "@/components/snapshot";
import { Nav } from "@/components/nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kept — disaster-relief promises you can verify",
  description:
    "Kept makes a disaster fund's two promises verifiable: to donors on how the money is used, and to affected households that no one is left out.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SnapshotProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-xs text-muted">
            Kept · open source (MIT) · built for the Web3 for Social Good Hackathon 2026. Personal data never goes on-chain:
            only commitments, hashes and pseudonymous receipt addresses.
          </footer>
        </SnapshotProvider>
      </body>
    </html>
  );
}
