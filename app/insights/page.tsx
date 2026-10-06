"use client";

import { motion } from "framer-motion";
import { InsightsPreview } from "@/components/sections/sections";
import { CategoryDonutChart, SavingsGrowthChart, WeeklySpendChart } from "@/components/shared/charts";
import { SectionTitle } from "@/components/shared/section-title";
import { FinancialTip } from "@/components/sections/financial-tip";
import { mockCategorySplit } from "@/data/mock-data";
import { naira, percentOf } from "@/lib/utils";

export default function InsightsPage() {
  const total = mockCategorySplit.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-caption font-semibold uppercase tracking-[0.14em] text-kobo-muted">
          Understand your money
        </p>
        <h1 className="mt-1 text-headline text-kobo-ink">Insights</h1>
        <p className="mt-1 max-w-2xl text-body text-kobo-muted">
          Clear, kind observations based on demo data — designed to inform you, never to shame you.
        </p>
      </motion.header>

      <InsightsPreview limit={6} title="All insights" showAction={false} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="split-heading" className="kobo-card p-5">
          <SectionTitle id="split-heading" title="Where money goes" subtitle="This month · demo data" />
          <CategoryDonutChart height={230} />
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {mockCategorySplit.map((item) => (
              <li key={item.name} className="flex items-center gap-2 text-caption">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                  aria-hidden
                />
                <span className="truncate text-kobo-muted">
                  {item.name} · <span className="font-bold text-kobo-ink">{naira(item.value)}</span>{" "}
                  ({percentOf(item.value, total)}%)
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="insight-week-heading" className="kobo-card p-5">
            <SectionTitle
              id="insight-week-heading"
              title="Weekly spending"
              subtitle="Mon–Sun · demo data"
            />
            <WeeklySpendChart height={200} />
          </section>

          <section aria-labelledby="insight-growth-heading" className="kobo-card p-5">
            <SectionTitle
              id="insight-growth-heading"
              title="Savings over time"
              subtitle="Six months · demo data"
            />
            <SavingsGrowthChart height={200} />
          </section>
        </div>
      </div>

      <FinancialTip />
    </div>
  );
}
