"use client";

import Link from "next/link";
import { Coins, PiggyBank, PieChart, Send } from "lucide-react";
import { useKoboStore } from "@/store/kobo-store";
import { cn } from "@/lib/utils";

const actions = [
  { key: "save", label: "Save", href: "/save", Icon: PiggyBank },
  { key: "budget", label: "Budget", href: "/budget", Icon: PieChart },
  { key: "send", label: "Send", href: "/send", Icon: Send },
  { key: "roundup", label: "Round Up", href: null, Icon: Coins },
] as const;

/** Quick actions — uniform neutral tiles, big tap targets, quiet feedback. */
export function QuickActions() {
  const simulateRoundUp = useKoboStore((s) => s.simulateRoundUp);

  return (
    <nav aria-label="Quick actions" className="grid grid-cols-4 gap-2.5">
      {actions.map((action) => {
        const inner = (
          <>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-kobo-slate-wash text-kobo-charcoal transition-colors group-hover:bg-kobo-teal-wash group-hover:text-kobo-teal-dark">
              <action.Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="mt-2 block text-caption font-semibold text-kobo-charcoal">
              {action.label}
            </span>
          </>
        );

        const className = cn(
          "kobo-tap group flex h-full flex-col items-center rounded-card border border-kobo-line bg-surface px-1 py-3.5 shadow-card",
          "transition hover:border-kobo-line hover:shadow-lift",
        );

        return action.href ? (
          <Link key={action.key} href={action.href} className={className} aria-label={`${action.label} — go to screen`}>
            {inner}
          </Link>
        ) : (
          <button
            key={action.key}
            onClick={simulateRoundUp}
            className={className}
            aria-label="Collect round-up spare change now"
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
