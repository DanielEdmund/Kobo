"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CircleAlert } from "lucide-react";
import { budgetStatus, useKoboStore } from "@/store/kobo-store";
import { budgetIcons, toneTile } from "@/components/shared/icon-map";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/shared/status-pill";
import { SectionTitle } from "@/components/shared/section-title";
import { Money } from "@/components/shared/money";
import { cn, naira, percentOf } from "@/lib/utils";

const toneFor = { safe: "teal", warning: "gold", limit: "gold", over: "rose" } as const;

/** Compact budget snapshot for the dashboard — see everything at a glance. */
export function BudgetOverview() {
  const budgets = useKoboStore((s) => s.budgets);
  const overCount = budgets.filter((b) => budgetStatus(b) === "over").length;

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <section aria-labelledby="budget-overview-heading">
      <SectionTitle
        id="budget-overview-heading"
        title="Budget status"
        subtitle={
          overCount > 0
            ? `${overCount} category needs a look — no stress, just a heads-up`
            : "Everything is comfortably on track"
        }
        action={
          <Link
            href="/budget"
            className="inline-flex items-center gap-1 text-caption font-bold text-kobo-teal-dark hover:gap-2"
          >
            Open <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      <div className="kobo-card p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-kobo-cream/70 px-4 py-3">
          <span className="text-caption font-semibold text-kobo-muted">This month overall</span>
          <span className="text-[0.95rem] font-bold text-kobo-ink">
            <Money value={totalSpent} /> <span className="font-medium text-kobo-muted">of</span>{" "}
            <Money value={totalLimit} />
          </span>
        </div>

        <ul className="space-y-4">
          {budgets.map((budget) => {
            const status = budgetStatus(budget);
            const Icon = budgetIcons[budget.icon];
            const percent = percentOf(budget.spent, budget.limit);

            return (
              <li key={budget.id}>
                <div className="flex items-center gap-3">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", toneTile[
                    status === "over"
                      ? "rose"
                      : status === "safe"
                        ? "teal"
                        : "gold"
                  ])}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[0.92rem] font-semibold text-kobo-ink">
                        {budget.category}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-caption font-bold text-kobo-muted">
                          {naira(budget.spent)} / {naira(budget.limit)}
                        </span>
                        <StatusPill status={status} className="hidden sm:inline-flex" />
                      </span>
                    </div>
                    <Progress value={percent} tone={toneFor[status]} className="mt-2 h-2" label={budget.category} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {overCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-2 rounded-2xl bg-kobo-rose-soft px-4 py-3 text-caption font-semibold text-kobo-rose-ink"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Shopping is over its demo limit. You can adjust any budget with one tap — spending
            isn&apos;t failure, it&apos;s information.
          </motion.p>
        )}
      </div>
    </section>
  );
}
