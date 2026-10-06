"use client";

import { AlertTriangle, BadgeCheck, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BudgetStatus } from "@/types";

const config: Record<
  BudgetStatus,
  { label: string; className: string; Icon: typeof BadgeCheck }
> = {
  safe: {
    label: "On track",
    className: "bg-kobo-mint text-kobo-mint-ink ring-1 ring-kobo-mint-deep",
    Icon: BadgeCheck,
  },
  warning: {
    label: "Almost there",
    className: "bg-kobo-gold-soft text-kobo-gold-deep ring-1 ring-kobo-gold/50",
    Icon: Clock3,
  },
  limit: {
    label: "At limit",
    className: "bg-kobo-gold-soft text-kobo-gold-deep ring-1 ring-kobo-gold/50",
    Icon: Clock3,
  },
  over: {
    label: "Over budget",
    className: "bg-kobo-rose-soft text-kobo-rose-ink ring-1 ring-kobo-rose-deep/50",
    Icon: AlertTriangle,
  },
};

/**
 * Status pill — never relies on colour alone.
 * Always pairs an icon + text with the tone (colour-blind friendly).
 */
export function StatusPill({
  status,
  className,
  labelOverride,
}: {
  status: BudgetStatus;
  className?: string;
  labelOverride?: string;
}) {
  const { label, className: toneClass, Icon } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.78rem] font-bold",
        toneClass,
        status === "over" && "animate-shake",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {labelOverride ?? label}
    </span>
  );
}
