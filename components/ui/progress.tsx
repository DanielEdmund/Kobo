"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tone = "teal" | "gold" | "coral" | "rose" | "mint" | "charcoal";

const toneBar: Record<Tone, string> = {
  teal: "bg-kobo-teal",
  gold: "bg-kobo-gold",
  coral: "bg-kobo-coral",
  rose: "bg-kobo-rose-deep",
  mint: "bg-kobo-mint-deep",
  charcoal: "bg-kobo-charcoal",
};

interface ProgressProps {
  /** 0–100 */
  value: number;
  tone?: Tone;
  className?: string;
  barClassName?: string;
  delay?: number;
  label?: string;
}

/** Animated, accessible progress bar — KoboProgress. */
export function Progress({
  value,
  tone = "teal",
  className,
  barClassName,
  delay = 0,
  label,
}: ProgressProps) {
  const reduce = useReducedMotion();
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(safe)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `Progress ${Math.round(safe)}%`}
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-pill bg-kobo-slate-deep",
        className,
      )}
    >
      <motion.div
        initial={reduce ? { width: `${safe}%` } : { width: 0 }}
        animate={{ width: `${safe}%` }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }
        }
        className={cn("h-full rounded-pill", toneBar[tone], barClassName)}
      />
      {/* Approach-limit subtle pulse */}
      {safe >= 85 && safe < 100 && !reduce && (
        <div className="pointer-events-none absolute inset-0 animate-pulse-soft rounded-pill ring-2 ring-inset ring-kobo-gold/40" />
      )}
      {/* Exceeded: rose overlay signal (never colour alone — paired with text/icons) */}
      {safe >= 100 && (
        <div className="pointer-events-none absolute inset-0 rounded-pill ring-2 ring-inset ring-kobo-rose-deep/60" />
      )}
    </div>
  );
}
