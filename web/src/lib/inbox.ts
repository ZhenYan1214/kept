"use client";
import { useEffect, useState } from "react";

/**
 * Demo stand-in for "scanning a QR code" between two devices. Messages are written to this
 * browser's localStorage so another tab (the township office, the NGO counter...) can pick them up.
 * Only public data or zero-knowledge proofs travel this way — never a household's secrets.
 */
export type InboxKind = "registration" | "claim" | "township-roster";

export type InboxMessage<T = unknown> = { id: string; kind: InboxKind; at: number; payload: T; consumed?: boolean };

const KEY = "kept.inbox";
const EVENT = "kept-inbox";

function read(): InboxMessage[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(list: InboxMessage[]) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(-200)));
  window.dispatchEvent(new Event(EVENT));
}

export function postInbox<T>(kind: InboxKind, payload: T): InboxMessage<T> {
  const msg = { id: crypto.randomUUID(), kind, at: Date.now(), payload };
  write([...read(), msg]);
  return msg;
}

export function consumeInbox(id: string) {
  write(read().map((m) => (m.id === id ? { ...m, consumed: true } : m)));
}

export function useInbox<T = unknown>(kind: InboxKind, includeConsumed = false): InboxMessage<T>[] {
  const [items, setItems] = useState<InboxMessage<T>[]>([]);
  useEffect(() => {
    const update = () =>
      setItems(read().filter((m) => m.kind === kind && (includeConsumed || !m.consumed)) as InboxMessage<T>[]);
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [kind, includeConsumed]);
  return items;
}
