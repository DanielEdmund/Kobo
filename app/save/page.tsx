"use client";

import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { useKoboStore, savingsProgress, totalSavings } from "@/store/kobo-store";
import { SavingsGoals, AchievementsSection } from "@/components/sections/sections";
import { RoundUpBanner } from "@/components/home/round-up-banner";
import { StreakCard } from "@/components/home/streak-card";
import { ProgressRing } from "@/components/shared/progress-ring";
import { SavingsGrowthChart } from "@/components/shared/charts";
import { SectionTitle } from "@/components/shared/section-title";
import { FinancialTip } from "@/components/sections/financial-tip";
import { Money } from "@/components/shared/money";

export default function SavePage() {
  const goals = useKoboStore((s) => s.goals);
  const savings = totalSavings(goals);
  const progress = savingsProgress(goals);
  const roundUpMonthly = useKoboStore((s) => s.roundUpMonthly);

  return (
    <div className="space-y-6">
      {/* Savings hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="save-heading"
        className="kobo-card flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left"
      >
        <ProgressRing value={progress} size={124} stroke={11} tone="teal" label={`Savings ${progress}% of all goals`}>
          <span className="grid place-items-center">
            <PiggyBank className="h-6 w-6 text-kobo-teal-dark" aria-hidden />
            <span className="text-[0.95rem] font-bold text-kobo-ink">{progress}%</span>
          </span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-kobo-muted">
            Total saved across 4 goals
          </p>
          <h1 id="save-heading" className="mt-1 text-display text-kobo-ink">
            <Money value={savings} />
          </h1>
          <p className="mt-2 text-body text-kobo-muted">
            You&apos;ve put away <span className="font-bold text-kobo-teal-dark">₦114,780</span>{" "}
            since your first save — mostly in small amounts. That&apos;s the whole trick.
          </p>
          <p className="mt-1 text-caption font-semibold text-kobo-gold-deep">
            +{roundUpMonthly.toLocaleString("en-NG")} from round-ups this month
          </p>
        </div>
      </motion.section>

      <SavingsGoals title="Your savings goals" />

      <section aria-labelledby="growth-heading">
        <SectionTitle
          id="growth-heading"
          title="Savings growth"
          subtitle="Six months of steady progress (demo data)"
        />
        <div className="kobo-card p-5">
          <SavingsGrowthChart />
        </div>
      </section>

      <RoundUpBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <StreakCard />
        <FinancialTip />
      </div>

      <AchievementsSection />
    </div>
  );
}
