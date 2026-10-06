import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-style class merge helper. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function percentOf(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

type NairaOptions = {
  /** "always" → ₦24,350.00 · "auto" → ₦24,350 (drops .00) */
  decimals?: "always" | "auto";
};

/** Formats a number as Nigerian Naira. Local mock formatting only. */
export function naira(value: number, options: NairaOptions = {}) {
  const { decimals = "auto" } = options;
  const rounded = Math.round(value * 100) / 100;
  const showDecimals = decimals === "always" || !Number.isInteger(rounded);
  return `₦${rounded.toLocaleString("en-NG", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
}

/** Compact money for tight spaces: ₦1.2k, ₦24k, ₦1.1m */
export function nairaCompact(value: number) {
  if (Math.abs(value) >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}m`;
  if (Math.abs(value) >= 10_000) return `₦${Math.round(value / 1000)}k`;
  if (Math.abs(value) >= 1000) return `₦${(value / 1000).toFixed(1)}k`;
  return naira(value);
}

/** Signed display for transactions: +₦25,000 / −₦4,500 */
export function signedNaira(value: number, type: "income" | "expense" | "refund" | "transfer") {
  const positive = type === "income" || type === "refund";
  return `${positive ? "+" : "−"}${naira(Math.abs(value))}`;
}

export function timeAgo(daysAgo: number) {
  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return "This week";
  return "Earlier";
}

/** Deterministic pseudo-random (safe for SSR — no Math.random in render). */
export function seeded(index: number, salt = 1) {
  const x = Math.sin(index * 97.13 + salt * 41.7) * 10000;
  return x - Math.floor(x);
}
