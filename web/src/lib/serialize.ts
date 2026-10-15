/** JSON round-trip that preserves bigint values ({"$n":"123"}). */
export function toJSONSafe(value: unknown): unknown {
  if (typeof value === "bigint") return { $n: value.toString() };
  if (Array.isArray(value)) return value.map(toJSONSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toJSONSafe(v)]));
  }
  return value;
}

export function fromJSONSafe(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(fromJSONSafe);
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.$n === "string" && Object.keys(o).length === 1) return BigInt(o.$n);
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, fromJSONSafe(v)]));
  }
  return value;
}
