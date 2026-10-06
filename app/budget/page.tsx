"use client";

import { motion } from "framer-motion";
import { budgetStatus, useKoboStore } from "@/store/kobo-store";
import { BudgetCard } from "@/components/budget/budget-card";
import { WeeklySpendChart } from "@/components/shared/charts";
import { SectionTitle } from "@/components/shared/section-title";
import { StatusPill } from "@/components/shared/status-pill";
import { FinancialTip } from "@/components/sections/financial-tip";
import { Money } from "@/components/shared/money";
import { naira } from "@/lib/utils";

export default function BudgetPage() {
  const budgets = useKoboStore((s) => s.budgets);

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const percent = Math.round((totalSpent / totalLimit) * 100);
  const overallStatus = budgets.some((b) => budgetStatus(b) === "over")
    ? "over"
    : percent >= 90
      ? "warning"
      : "safe";

  return (
    <div className="space-y-6">
      {/* Monthly summary */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="budget-heading"
        className="kobo-card p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-kobo-muted">
              September plan · demo data
            </p>
            <h1 id="budget-heading" className="mt-1 text-headline text-kobo-ink">
              You&apos;ve planned {naira(totalLimit)} this month
            </h1>
          </div>
          <StatusPill status={overallStatus} />
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div>
            <p className="text-caption text-kobo-muted">Spent so far</p>
            <p className="text-2xl font-bold text-kobo-ink">
              <Money value={totalSpent} />
            </p>
          </div>
          <div>
            <p className="text-caption text-kobo-muted">Still available</p>
            <p className="text-2xl font-bold text-kobo-mint-ink">
              <Money value={totalRemaining} />
            </p>
          </div>
          <div>
            <p className="text-caption text-kobo-muted">Used</p>
            <p className="text-2xl font-bold text-kobo-teal-dark">{percent}%</p>
          </div>
        </div>
      </motion.section>

      {/* Category budgets */}
      <section aria-labelledby="categories-heading">
        <SectionTitle
          id="categories-heading"
          title="Category budgets"
          subtitle="Log a demo expense or adjust any limit"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget, i) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <BudgetCard budget={budget} />
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="budget-chart-heading" className="kobo-card p-5">
          <SectionTitle
            id="budget-chart-heading"
            title="Spending this week"
            subtitle="Demo data · tap categories above to log expenses"
          />
          <WeeklySpendChart height={210} />
        </section>

        <div className="space-y-6">
          <section className="kobo-card border-kobo-teal/25 bg-kobo-teal-wash p-5">
            <h2 className="text-title text-kobo-ink">Budgets are maps, not rules</h2>
            <p className="mt-2 text-body text-kobo-muted">
              Going over in one place doesn&apos;t mean you&apos;ve failed — it just tells you
              where reality differs from the plan. Adjust the plan whenever life changes.
            </p>
          </section>
          <FinancialTip />
        </div>
      </div>
    </div>
  );
}
