import { AppShell } from "@/components/app-shell";

/** The demo app: every role page and the public dashboard of the simulated fund. */
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
