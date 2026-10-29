import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { SnapshotProvider } from "@/components/snapshot";
import { ToastProvider } from "@/components/toast";

const sans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Kept — know the aid arrived",
  description:
    "Kept follows donated money hand by hand to the household it was meant for, and lets that household say, on a public record, whether it arrived.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#121a22" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} min-h-dvh antialiased`}>
        <SnapshotProvider>
          <ToastProvider>{children}</ToastProvider>
        </SnapshotProvider>
      </body>
    </html>
  );
}
