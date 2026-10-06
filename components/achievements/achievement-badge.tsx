"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Achievement } from "@/types";
import { useKoboStore } from "@/store/kobo-store";
import { achievementIcons } from "@/components/shared/icon-map";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
  /** clicking a locked badge simulates an unlock */
  interactive?: boolean;
}

/** Achievement badge — gold for unlocked, muted + lock for locked. */
export function AchievementBadge({ achievement, interactive = true }: AchievementBadgeProps) {
  const unlock = useKoboStore((s) => s.unlockAchievement);
  const reduce = useReducedMotion();
  const Icon = achievementIcons[achievement.icon];
  const { unlocked } = achievement;

  return (
    <motion.button
      type="button"
      disabled={!interactive}
      onClick={() => !unlocked && unlock(achievement.id)}
      whileHover={unlocked && !reduce ? { y: -2 } : {}}
      whileTap={{ scale: 0.98 }}
      aria-label={`${achievement.name} — ${unlocked ? achievement.unlockedLabel ?? "Unlocked" : "Locked. Activate to simulate unlocking."}`}
      className={cn(
        "kobo-card flex flex-col items-center gap-2 p-4 text-center transition",
        unlocked ? "ring-1 ring-kobo-gold/50" : "opacity-90",
        !unlocked && interactive && "hover:ring-2 hover:ring-kobo-teal/50",
      )}
    >
      <span
        className={cn(
          "relative grid h-16 w-16 place-items-center rounded-full",
          unlocked
            ? "bg-kobo-gold-soft text-kobo-gold-deep"
            : "bg-kobo-slate-wash text-kobo-muted",
        )}
      >
        <Icon className="h-7 w-7" aria-hidden />
        {!unlocked && (
          <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-white shadow-card">
            <Lock className="h-3.5 w-3.5 text-kobo-muted" aria-hidden />
          </span>
        )}
      </span>

      <span className="text-[0.86rem] font-semibold leading-tight text-kobo-ink">
        {achievement.name}
      </span>
      <span className={cn("text-[0.72rem] font-medium", unlocked ? "text-kobo-gold-deep" : "text-kobo-muted")}>
        {unlocked ? achievement.unlockedLabel ?? "Unlocked" : "Locked"}
      </span>
    </motion.button>
  );
}

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}
