"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { BalanceHeader } from "@/components/home/balance-header";
import { QuickActions } from "@/components/home/quick-actions";
import { RoundUpBanner } from "@/components/home/round-up-banner";
import { StreakCard } from "@/components/home/streak-card";
import { BudgetOverview } from "@/components/sections/budget-overview";
import { CoinPileCard } from "@/components/sections/coin-pile-card";
import { AchievementsSection, InsightsPreview, SavingsGoals } from "@/components/sections/sections";
import { TransactionList } from "@/components/transactions/transaction-list";
import { FinancialTip } from "@/components/sections/financial-tip";
import { WeeklySpendChart } from "@/components/shared/charts";
import { SectionTitle } from "@/components/shared/section-title";
import { useKoboStore } from "@/store/kobo-store";

/** Pull-to-refresh strip — pull the coin down to refresh demo data. */
function PullToRefresh() {
  const refresh = useKoboStore((s) => s.refresh);
  const refreshing = useKoboStore((s) => s.refreshing);

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.4}
      onDragEnd={(_, info) => {
        if (info.offset.y > 56 && !refreshing) refresh();
      }}
      className="flex h-9 cursor-grab select-none items-center justify-center gap-2 text-caption font-medium text-kobo-muted active:cursor-grabbing"
      role="button"
      tabIndex={0}
      aria-label="Pull down or press to refresh demo data"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") refresh();
      }}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-kobo-teal-wash text-kobo-teal-dark">
        <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} aria-hidden />
      </span>
      {refreshing ? "Refreshing demo data…" : "Pull to refresh"}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PullToRefresh />

      <BalanceHeader />
      <QuickActions />
      <RoundUpBanner />

      {/* Dashboard: main column + side panel on large screens */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SavingsGoals limit={4} title="Your savings goals" />
          <BudgetOverview />
          <TransactionList limit={6} showViewAll />
          <InsightsPreview limit={2} />
          <AchievementsSection />
        </div>

        <div className="space-y-6">
          <StreakCard />
          <CoinPileCard />

          <section aria-labelledby="week-spend-heading" className="kobo-card p-5">
            <SectionTitle
              id="week-spend-heading"
              title="This week's spending"
              subtitle="Demo data · Mon–Sun"
            />
            <WeeklySpendChart height={190} />
            <p className="mt-2 text-center text-[0.72rem] font-medium text-kobo-muted">
              Friday was your highest-spend day this week.
            </p>
          </section>

          <FinancialTip />
        </div>
      </div>

      {/* Encouraging closer */}
      <p className="pb-2 text-center text-caption font-medium text-kobo-muted">
        Every kobo counts. Small, consistent steps add up.
      </p>
    </div>
  );
}
