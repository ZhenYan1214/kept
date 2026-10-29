/**
 * Kept's own icon set: 20×20, 1.6px strokes, round joins, drawn for this project so the interface does
 * not look like every other dashboard. Icons inherit the text colour.
 */
type P = { className?: string; title?: string };

function Svg({ className, title, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-4 w-4"}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** The mark: a house that is also a speech bubble, with the record inside: a household's own say. Traced from the logo artwork. */
const HOUSE =
  "M600 280L300 448L312 520V825C312 888 357 937 418 937H780Q805 937 825 952L895 1003Q918 1018 931 993L907 927Q904 913 915 903Q941 876 941 840V520L953 448L655 280Q627 266 600 280ZM627 355L385 490V828Q385 865 422 865H830Q869 865 869 828V490Z";

function HouseShapes({ house, lines }: { house: string; lines: string }) {
  return (
    <>
      <g fill={house}>
        <path fillRule="evenodd" d={HOUSE} />
        <circle cx="309" cy="484" r="37" />
        <circle cx="945" cy="484" r="37" />
      </g>
      <g fill={lines}>
        <rect x="427" y="571" width="363" height="73" rx="36.5" />
        <rect x="427" y="680" width="283" height="73" rx="36.5" />
      </g>
    </>
  );
}

export function KeptMark({ className, seal = true, plain = false }: { className?: string; seal?: boolean; plain?: boolean }) {
  // seal: the full logo on its cream tile, so the navy lines read in either theme. plain: the coral house with the
  // lines in the text colour, for headers. Neither: the whole mark in the text colour (e.g. on the credential card).
  if (plain) {
    return (
      <svg viewBox="237 252 780 780" className={className ?? "h-8 w-8"} aria-hidden>
        <HouseShapes house="#f16646" lines="currentColor" />
      </svg>
    );
  }
  if (!seal) {
    return (
      <svg viewBox="237 252 780 780" className={className ?? "h-8 w-8"} aria-hidden>
        <HouseShapes house="currentColor" lines="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="157 172 940 940" className={className ?? "h-8 w-8"} aria-hidden>
      <rect x="157" y="172" width="940" height="940" rx="210" fill="#f8f4ee" />
      <HouseShapes house="#f16646" lines="#1b2935" />
    </svg>
  );
}

export const Icon = {
  Chain: (p: P) => (
    <Svg {...p}>
      <rect x="2.5" y="7.5" width="6" height="5" rx="2.5" />
      <rect x="11.5" y="7.5" width="6" height="5" rx="2.5" />
      <path d="M8.5 10h3" />
    </Svg>
  ),
  Seal: (p: P) => (
    <Svg {...p}>
      <rect x="4" y="3" width="12" height="10" rx="2" />
      <path d="M7 6.5h6M7 9.5h4" />
      <path d="M6.5 16.5h7M10 13v3.5" />
    </Svg>
  ),
  House: (p: P) => (
    <Svg {...p}>
      <path d="M3 9.2 10 3.5l7 5.7" />
      <path d="M4.8 8v8.5h10.4V8" />
      <path d="M8.3 16.5v-4.3h3.4v4.3" />
    </Svg>
  ),
  Check: (p: P) => (
    <Svg {...p}>
      <path d="m4 10.5 3.8 3.7L16 6" />
    </Svg>
  ),
  Cross: (p: P) => (
    <Svg {...p}>
      <path d="m5 5 10 10M15 5 5 15" />
    </Svg>
  ),
  Eye: (p: P) => (
    <Svg {...p}>
      <path d="M2 10s3-5.5 8-5.5 8 5.5 8 5.5-3 5.5-8 5.5S2 10 2 10Z" />
      <circle cx="10" cy="10" r="2.4" />
    </Svg>
  ),
  EyeOff: (p: P) => (
    <Svg {...p}>
      <path d="M2 10s3-5.5 8-5.5c1.4 0 2.6.4 3.7 1M18 10s-3 5.5-8 5.5c-1.4 0-2.6-.4-3.7-1" />
      <path d="M3.5 16.5 16.5 3.5" />
    </Svg>
  ),
  Alert: (p: P) => (
    <Svg {...p}>
      <path d="M10 3 18 16.5H2L10 3Z" />
      <path d="M10 8.2v3.6M10 14.2v.1" />
    </Svg>
  ),
  Ballot: (p: P) => (
    <Svg {...p}>
      <path d="M3 11.5h14v5.5H3z" />
      <path d="M6.5 11.5 9 3.5l5 1.6-2 6.4" />
      <path d="M7.5 14.3h5" />
    </Svg>
  ),
  Sample: (p: P) => (
    <Svg {...p}>
      <circle cx="8.5" cy="8.5" r="5" />
      <path d="m12.2 12.2 4.8 4.8" />
      <path d="m6.3 8.6 1.6 1.6 2.9-3" />
    </Svg>
  ),
  Clock: (p: P) => (
    <Svg {...p}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4.2l2.8 1.8" />
    </Svg>
  ),
  Download: (p: P) => (
    <Svg {...p}>
      <path d="M10 3v9.5M6 8.8l4 3.9 4-3.9" />
      <path d="M3.5 14.5V17h13v-2.5" />
    </Svg>
  ),
  Arrow: (p: P) => (
    <Svg {...p}>
      <path d="M3.5 10h12.5M11.5 5.5 16 10l-4.5 4.5" />
    </Svg>
  ),
  ArrowDown: (p: P) => (
    <Svg {...p}>
      <path d="M10 3.5V16M5.5 11.5 10 16l4.5-4.5" />
    </Svg>
  ),
  External: (p: P) => (
    <Svg {...p}>
      <path d="M8 4H4.5v11.5H16V12" />
      <path d="M11 3.5h5.5V9M16.5 3.5 9.5 10.5" />
    </Svg>
  ),
  Menu: (p: P) => (
    <Svg {...p}>
      <path d="M3 6h14M3 10h14M3 14h14" />
    </Svg>
  ),
  People: (p: P) => (
    <Svg {...p}>
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="13.8" cy="8" r="2.1" />
      <path d="M2.5 16.5c.6-2.8 2.4-4.3 4.5-4.3s3.9 1.5 4.5 4.3M12 12.4c.6-.3 1.2-.4 1.8-.4 1.8 0 3.2 1.3 3.7 3.6" />
    </Svg>
  ),
  Building: (p: P) => (
    <Svg {...p}>
      <path d="M3 17h14M4.5 17V8.5L10 4l5.5 4.5V17" />
      <path d="M7.5 17v-4.5M10 17v-4.5M12.5 17v-4.5" />
    </Svg>
  ),
  Handoff: (p: P) => (
    <Svg {...p}>
      <path d="M2.5 7h9.5M9 4l3 3-3 3" />
      <path d="M17.5 13H8M11 16l-3-3 3-3" />
    </Svg>
  ),
  Ledger: (p: P) => (
    <Svg {...p}>
      <path d="M4.5 3.5h9.5a1.5 1.5 0 0 1 1.5 1.5v11.5H6a1.5 1.5 0 0 1-1.5-1.5V3.5Z" />
      <path d="M4.5 15A1.5 1.5 0 0 1 6 13.5h9.5" />
      <path d="M7.5 6.5h5M7.5 9.2h5" />
    </Svg>
  ),
  Card: (p: P) => (
    <Svg {...p}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.8" />
      <rect x="5" y="7.2" width="3.6" height="3.6" rx=".6" />
      <path d="M11 8h4M11 10.8h3" />
    </Svg>
  ),
  Coin: (p: P) => (
    <Svg {...p}>
      <ellipse cx="10" cy="6" rx="6" ry="2.5" />
      <path d="M4 6v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" />
      <path d="M4 10v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
    </Svg>
  ),
  Flag: (p: P) => (
    <Svg {...p}>
      <path d="M4.5 17.5v-14" />
      <path d="M4.5 4h10l-2 3.3 2 3.3h-10" />
    </Svg>
  ),
  Shield: (p: P) => (
    <Svg {...p}>
      <path d="M10 2.8 16 5v4.6c0 3.7-2.6 6.4-6 7.6-3.4-1.2-6-3.9-6-7.6V5l6-2.2Z" />
      <path d="m7.3 10 1.9 1.9 3.6-3.7" />
    </Svg>
  ),
  Settings: (p: P) => (
    <Svg {...p}>
      <path d="M4 5.5h6M14 5.5h2M4 10h2M10 10h6M4 14.5h8M16 14.5h0" />
      <circle cx="12" cy="5.5" r="1.8" />
      <circle cx="8" cy="10" r="1.8" />
      <circle cx="14" cy="14.5" r="1.8" />
    </Svg>
  ),
  Info: (p: P) => (
    <Svg {...p}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9v4.5M10 6.3v.1" />
    </Svg>
  ),
};
