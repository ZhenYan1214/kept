import { SiteFooter, SiteNav } from "@/components/site-chrome";

/** The public site: the landing page, the real Guangfu records and the case for Kept. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}
