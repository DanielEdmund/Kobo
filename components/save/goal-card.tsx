"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import type { SavingsGoal } from "@/types";
import { useKoboStore } from "@/store/kobo-store";
import { ProgressRing } from "@/components/shared/progress-ring";
import { Progress } from "@/components/ui/progress";
import { goalIcons, toneTile } from "@/components/shared/icon-map";
import { Money } from "@/components/shared/money";
import { percentOf, cn, naira } from "@/lib/utils";

const accentTone: Record<SavingsGoal["accent"], "teal" | "gold" | "coral" | "mint"> = {
  teal: "teal",
  gold: "gold",
  coral: "coral",
  mint: "mint",
};

const quickAdds = [100, 500, 1000];

interface GoalCardProps {
  goal: SavingsGoal;
  index?: number;
}

/**
 * Savings goal card — ring + bar progress, quick-add coins,
 * friendly status line, milestone celebration.
 */
export function GoalCard({ goal, index = 0 }: GoalCardProps) {
  const addToGoal = useKoboStore((s) => s.addToGoal);
  const burst = useKoboStore((s) => s.coinBurst);
  const reduce = useReducedMotion();

  const Icon = goalIcons[goal.icon];
  const percent = percentOf(goal.saved, goal.target);
  const complete = goal.saved >= goal.target;
  const tone = accentTone[goal.accent];
  const celebrating = burst?.goalId === goal.id;

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reduce
          ? { duration: 0 }
          : celebrating
            ? { duration: 0.25, ease: "easeOut" }
            : { delay: 0.03 * index, duration: 0.28, ease: [0.22, 1, 0.36, 1] }
      }
      className={cn(
        "kobo-card relative overflow-hidden p-5",
        complete && "ring-2 ring-kobo-gold/60",
      )}
    >
      {/* Celebrate a completed goal with a soft gold wash */}
      {complete && (
        <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-kobo-gold-soft" aria-hidden />
      )}

      <div className="relative flex items-start gap-4">
        <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", toneTile[tone])}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-title text-kobo-ink">{goal.name}</h3>
              <p className="mt-0.5 text-caption font-normal text-kobo-muted">
                {complete ? "Goal complete" : goal.status}
              </p>
            </div>

            <ProgressRing value={percent} size={64} stroke={7} tone={tone} label={`${goal.name} ${percent}%`}>
              <span className="text-[0.8rem] font-bold text-kobo-ink">{percent}%</span>
            </ProgressRing>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <Money value={goal.saved} className="text-[1.3rem] font-bold text-kobo-ink" />
            <span className="text-caption text-kobo-muted">
              of <Money value={goal.target} />
            </span>
          </div>

          <Progress
            value={percent}
            tone={tone === "mint" ? "mint" : tone}
            className="mt-2.5"
            label={`${goal.name} saved ${naira(goal.saved)} of ${naira(goal.target)}`}
          />
        </div>
      </div>

      {/* Quick add — small wins, celebrated */}
      <div className="relative mt-4 flex items-center gap-2">
        {quickAdds.map((amount) => (
          <button
            key={amount}
            onClick={() => addToGoal(goal.id, amount)}
            aria-label={`Add ${naira(amount)} to ${goal.name}`}
            className="kobo-tap flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-kobo-line bg-white text-sm font-semibold text-kobo-charcoal transition-colors hover:border-kobo-teal hover:text-kobo-teal-dark"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            {naira(amount)}
          </button>
        ))}
      </div>
    </motion.article>
  );
}
