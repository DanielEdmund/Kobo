"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useKoboStore } from "@/store/kobo-store";
import { GoalCard } from "@/components/save/goal-card";
import { InsightCard } from "@/components/insights/insight-card";
import { AchievementGrid } from "@/components/achievements/achievement-badge";
import { SectionTitle } from "@/components/shared/section-title";

/** Savings goals section — all four mock goals with progress + quick add. */
export function SavingsGoals({ limit, title = "Savings goals" }: { limit?: number; title?: string }) {
  const goals = useKoboStore((s) => s.goals);
  const visible = limit ? goals.slice(0, limit) : goals;

  return (
    <section aria-labelledby="goals-heading">
      <SectionTitle
        id="goals-heading"
        title={title}
        subtitle="Tap +₦100 · +₦500 · +₦1,000 to add to any goal"
        action={
          <Link
            href="/save"
            className="inline-flex items-center gap-1 text-caption font-bold text-kobo-teal-dark hover:gap-2"
          >
            See all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((goal, i) => (
          <GoalCard key={goal.id} goal={goal} index={i} />
        ))}
      </div>
    </section>
  );
}

/** Smart insights section — friendly, never judgemental. */
export function InsightsPreview({
  limit = 2,
  title = "Smart insights",
  showAction = true,
}: {
  limit?: number;
  title?: string;
  showAction?: boolean;
}) {
  const insights = useKoboStore((s) => s.insights);

  return (
    <section aria-labelledby="insights-heading">
      <SectionTitle
        id="insights-heading"
        title={title}
        subtitle="Gentle observations about your demo spending"
        action={
          showAction ? (
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-caption font-bold text-kobo-teal-dark hover:gap-2"
            >
              See all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : undefined
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {insights.slice(0, limit).map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>
    </section>
  );
}

/** Achievements section — celebrate small wins. */
export function AchievementsSection({ title = "Achievements" }: { title?: string }) {
  const achievements = useKoboStore((s) => s.achievements);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section aria-labelledby="achievements-heading">
      <SectionTitle
        id="achievements-heading"
        title={title}
        subtitle={`${unlockedCount} of ${achievements.length} unlocked · tap a locked badge to simulate an unlock`}
      />
      <AchievementGrid achievements={achievements} />
    </section>
  );
}
