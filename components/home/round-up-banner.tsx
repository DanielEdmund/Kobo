"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { mockRoundUp } from "@/data/mock-data";
import { useKoboStore } from "@/store/kobo-store";
import { Switch } from "@/components/ui/switch";
import { naira } from "@/lib/utils";

/**
 * Round-up banner — spare change visibly flows into the savings jar.
 * All round-up activity is simulated.
 */
export function RoundUpBanner() {
  const roundUpsOn = useKoboStore((s) => s.roundUpsOn);
  const toggle = useKoboStore((s) => s.toggleRoundUps);
  const simulate = useKoboStore((s) => s.simulateRoundUp);
  const monthly = useKoboStore((s) => s.roundUpMonthly);
  const today = useKoboStore((s) => s.roundUpToday);
  const reduce = useReducedMotion();

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="roundup-heading"
      className="relative overflow-hidden rounded-card border border-kobo-teal/25 bg-kobo-teal-wash p-5 shadow-card"
    >
      <span
        className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-kobo-teal/10"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-kobo-teal px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-wide text-white">
            Round-Ups {roundUpsOn ? "ON" : "OFF"}
          </span>
          <h2 id="roundup-heading" className="mt-3 text-title leading-snug text-kobo-ink">
            You&apos;ve saved{" "}
            <span className="font-bold text-kobo-teal-dark">{naira(monthly)}</span> this month
            from round-ups
          </h2>
          {today > 0 && (
            <p className="mt-1 text-caption font-semibold text-kobo-teal-dark">
              +{naira(today)} collected this session
            </p>
          )}
        </div>

        {/* Savings jar illustration */}
        <div className="relative grid h-24 w-20 shrink-0 place-items-end justify-center">
          <div className="relative flex h-20 w-16 items-end justify-center rounded-b-2xl rounded-t-md border-2 border-kobo-teal/50 bg-white/70 pb-2">
            {/* coins inside the jar */}
            <span className="absolute bottom-1.5 h-2 w-10 rounded-full bg-kobo-gold/80" />
            <span className="absolute bottom-4 h-2 w-9 rounded-full bg-kobo-gold" />
            <span className="absolute bottom-6.5 h-2 w-10 rounded-full bg-kobo-gold-deep/70" />
            <PiggyBank className="relative h-7 w-7 text-kobo-teal-dark" aria-hidden />
          </div>
        </div>
      </div>

      {/* The round-up math: ₦450 → +₦50 → ₦500 */}
      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-xl border border-kobo-teal/15 bg-white px-3 py-2 text-caption font-medium text-kobo-charcoal">
          Spent {naira(mockRoundUp.demoSpend)}
        </span>
        <span className="text-kobo-teal-dark" aria-hidden>
          →
        </span>
        <span className="rounded-xl bg-kobo-gold-soft px-3 py-2 text-caption font-semibold text-kobo-gold-deep">
          Round-up +{naira(mockRoundUp.demoRoundUp)}
        </span>
        <span className="text-kobo-teal-dark" aria-hidden>
          →
        </span>
        <span className="rounded-xl border border-kobo-teal/15 bg-white px-3 py-2 text-caption font-medium text-kobo-charcoal">
          Total {naira(mockRoundUp.demoTotal)}
        </span>
      </div>

      <div className="relative mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 rounded-xl bg-white/80 px-4 py-1">
          <Switch
            checked={roundUpsOn}
            onChange={toggle}
            label={`Round-Ups ${roundUpsOn ? "ON" : "OFF"}`}
            description="Round every purchase up to the next ₦100"
            tone="teal"
          />
        </div>

        <button
          onClick={simulate}
          disabled={!roundUpsOn}
          className="kobo-tap h-14 shrink-0 rounded-full bg-kobo-teal px-6 text-sm font-semibold text-white shadow-teal transition hover:bg-kobo-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Collect spare change
        </button>
      </div>
    </motion.section>
  );
}
