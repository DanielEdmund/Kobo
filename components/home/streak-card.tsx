"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { useKoboStore } from "@/store/kobo-store";
import { Progress } from "@/components/ui/progress";
import { cn, percentOf } from "@/lib/utils";

/** Savings streak — calendar days, growing fire, milestone progress. */
export function StreakCard() {
  const streak = useKoboStore((s) => s.streak);
  const saveToday = useKoboStore((s) => s.saveToday);
  const reduce = useReducedMotion();

  const toNext = Math.max(0, streak.nextMilestone - streak.days);
  const milestonePercent = percentOf(streak.days, streak.nextMilestone);

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="streak-heading"
      className="kobo-card overflow-hidden p-5"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-kobo-coral-soft text-kobo-coral-deep">
          <Flame className="h-7 w-7" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <h2 id="streak-heading" className="text-title text-kobo-ink">
            <span className="inline-block font-bold">{streak.days}-day saving streak</span>
          </h2>
          <p className="text-caption font-normal text-kobo-muted">
            {toNext > 0
              ? `${toNext} more days to your ${streak.nextMilestone}-day milestone`
              : `Milestone reached — ${streak.nextMilestone} days!`}
          </p>
        </div>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-pill bg-kobo-gold-soft px-3 py-1.5 text-caption font-bold text-kobo-gold-deep sm:inline-flex">
          <Trophy className="h-4 w-4" aria-hidden />
          {streak.nextMilestone}d
        </span>
      </div>

      {/* Week calendar */}
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {streak.week.map((day, i) => (
          <motion.div
            key={day.label}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl py-2",
              day.done ? "bg-kobo-mint text-kobo-mint-ink" : "bg-kobo-slate-wash text-kobo-muted",
            )}
            aria-label={`${day.label}: ${day.done ? "saved" : "no save yet"}`}
          >
            <span className="text-[0.65rem] font-semibold uppercase">{day.label}</span>
            <span className="text-[0.8rem] font-bold">{day.done ? "✓" : day.day}</span>
          </motion.div>
        ))}
      </div>

      <Progress value={milestonePercent} tone="gold" className="mt-4" label="Progress to next streak milestone" />

      <button
        onClick={saveToday}
        disabled={streak.savedToday}
        className={cn(
          "kobo-tap mt-4 w-full rounded-full text-sm font-semibold transition",
          streak.savedToday
            ? "cursor-default bg-kobo-slate-wash text-kobo-muted"
            : "bg-kobo-teal text-white shadow-teal hover:bg-kobo-teal-deep",
        )}
      >
        {streak.savedToday ? "Saved for today" : "Save something today (demo)"}
      </button>
    </motion.section>
  );
}
