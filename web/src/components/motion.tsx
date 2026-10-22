"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Calls back once when the element first scrolls into view. */
function useInView<T extends Element>(onIn: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || reduced()) {
      onIn();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onIn();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/** Fades a block up the first time it is seen. Content is always rendered (no layout shift). */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [inView, setIn] = useState(false);
  // Hidden only once the browser has taken over, so the page reads fine without JavaScript.
  const [armed, setArmed] = useState(false);
  useLayoutEffect(() => setArmed(!reduced()), []);
  const ref = useInView<HTMLDivElement>(() => setIn(true));
  const cls = armed ? (inView ? "reveal is-in" : "reveal") : "";
  return (
    <div ref={ref} className={`${cls} ${className ?? ""}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Counts a figure up from zero the first time it is seen; prints the final value without motion. */
export function CountUp({ value, format, duration = 1100 }: { value: number; format: (n: number) => string; duration?: number }) {
  const [shown, setShown] = useState<number | null>(null);
  // The server renders the final figure; before the first paint in the browser it starts from zero.
  useLayoutEffect(() => {
    if (!reduced()) setShown(0);
  }, []);
  const ref = useInView<HTMLSpanElement>(() => {
    if (reduced()) return setShown(value);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return (
    <span ref={ref} className="tabular-nums">
      {format(shown ?? value)}
    </span>
  );
}
