"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Icon } from "./icons";
import { cx } from "./ui";
import { EXPLORER_URL } from "@/lib/config";

/** What a transaction is doing, shown in the corner so every action gets feedback where the eye is not. */
type Toast = { id: number; state: "pending" | "done" | "error"; title: string; detail?: string; hash?: string };

type Ctx = {
  start: (title: string) => number;
  done: (id: number, title: string, hash?: string, detail?: string) => void;
  fail: (id: number, detail: string) => void;
};

const ToastContext = createContext<Ctx | null>(null);

/** Optional: components outside the provider simply get no toasts. */
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);

  const drop = useCallback((id: number, after: number) => {
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), after);
  }, []);

  const start = useCallback((title: string) => {
    const id = next.current++;
    setToasts((ts) => [...ts.slice(-2), { id, state: "pending", title }]);
    return id;
  }, []);

  const done = useCallback(
    (id: number, title: string, hash?: string, detail?: string) => {
      setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, state: "done", title, hash, detail } : t)));
      drop(id, 6000);
    },
    [drop],
  );

  const fail = useCallback(
    (id: number, detail: string) => {
      setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, state: "error", title: "Refused", detail } : t)));
      drop(id, 8000);
    },
    [drop],
  );

  return (
    <ToastContext.Provider value={{ start, done, fail }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="toast-in pointer-events-auto flex items-start gap-3 rounded-xl bg-[#1b2935] px-4 py-3.5 text-[#fffdf9] shadow-[0_20px_40px_-12px_rgb(27_41_53/0.45)]"
          >
            <span
              className={cx(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                t.state === "pending" && "border-2 border-white/25 border-t-white animate-spin",
                t.state === "done" && "pop bg-[#2c7350]",
                t.state === "error" && "pop bg-[#b3261e]",
              )}
            >
              {t.state === "done" && <Icon.Check className="h-3.5 w-3.5" />}
              {t.state === "error" && <Icon.Cross className="h-3 w-3" />}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.detail && <p className="mt-0.5 text-[13px] leading-snug text-white/70">{t.detail}</p>}
              {t.hash && EXPLORER_URL && (
                <a
                  href={`${EXPLORER_URL}/tx/${t.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block font-mono text-xs text-[#f6a08a] hover:underline"
                >
                  {t.hash.slice(0, 10)}…{t.hash.slice(-4)} ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
