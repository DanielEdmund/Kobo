"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useKoboStore } from "@/store/kobo-store";
import { backdropVariants, modalVariants } from "@/lib/tokens";
import { Button } from "@/components/ui/button";

/**
 * Milestone confirmation dialog — a calm, brief acknowledgement of progress.
 * No confetti or looping motion: the information is the celebration.
 */
export function CelebrationModal() {
  const celebration = useKoboStore((s) => s.celebration);
  const clear = useKoboStore((s) => s.clearCelebration);

  return (
    <AnimatePresence>
      {celebration && (
        <div className="fixed inset-0 z-[70] grid place-items-center px-5">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-kobo-ink/40"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={celebration.title}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm rounded-card border border-kobo-line bg-surface p-7 text-center shadow-lift"
          >
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-kobo-teal-wash text-kobo-teal-dark">
              <Trophy className="h-7 w-7" aria-hidden />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-headline text-kobo-ink"
            >
              {celebration.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-2 text-body text-kobo-muted"
            >
              {celebration.subtitle}
            </motion.p>

            <Button className="mt-6 w-full" size="lg" onClick={clear}>
              Continue
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Quiet status chip shown when a goal crosses 25/50/75%. */
export function MilestoneBurst() {
  const milestone = useKoboStore((s) => s.milestone);
  const goals = useKoboStore((s) => s.goals);
  const clear = useKoboStore((s) => s.clearMilestone);

  const goal = goals.find((g) => g.id === milestone?.goalId);

  return (
    <AnimatePresence>
      {milestone && goal && !milestone.complete && (
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onAnimationComplete={() => window.setTimeout(clear, 2200)}
          role="status"
          className="fixed inset-x-0 bottom-28 z-[65] mx-auto flex w-fit items-center gap-2.5 rounded-pill border border-kobo-line bg-surface px-5 py-3 shadow-lift lg:bottom-12"
        >
          <span className="text-sm font-bold text-kobo-teal-dark">{milestone.percent}%</span>
          <span className="text-sm font-medium text-kobo-charcoal">
            {goal.name} milestone reached
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
