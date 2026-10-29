/** Reading pages on the public site keep the narrower column they were written for. */
export default function ContentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 md:pt-14">{children}</main>;
}
