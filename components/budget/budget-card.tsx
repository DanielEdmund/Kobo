"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, SlidersHorizontal } from "lucide-react";
import type { Budget } from "@/types";
import { budgetStatus, statusMeta, useKoboStore } from "@/store/kobo-store";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/shared/status-pill";
import { budgetIcons, toneTile } from "@/components/shared/icon-map";
import { Money } from "@/components/shared/money";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn, naira, percentOf } from "@/lib/utils";

const toneFor = { safe: "teal", warning: "gold", limit: "gold", over: "rose" } as const;

interface BudgetCardProps {
  budget: Budget;
}

/** Category budget card — animated bar, icon + text status (never colour alone). */
export function BudgetCard({ budget }: BudgetCardProps) {
  const spend = useKoboStore((s) => s.spendFromBudget);
  const adjustLimit = useKoboStore((s) => s.adjustBudgetLimit);
  const reduce = useReducedMotion();

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitDraft, setLimitDraft] = useState(String(budget.limit));

  const status = budgetStatus(budget);
  const Icon = budgetIcons[budget.icon];
  const meta = statusMeta[status];
  const percent = percentOf(budget.spent, budget.limit);
  const remaining = Math.max(0, budget.limit - budget.spent);
  const over = budget.spent - budget.limit;

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "kobo-card p-5",
        status === "over" && "ring-2 ring-kobo-rose-deep/40",
        status === "over" && !reduce && "animate-shake",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
            toneTile[meta.tone],
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-title text-kobo-ink">{budget.category}</h3>
            <StatusPill status={status} />
          </div>

          <p className="mt-1 flex flex-wrap items-baseline gap-1.5">
            <Money value={budget.spent} className="text-[1.2rem] font-bold text-kobo-ink" />
            <span className="text-caption text-kobo-muted">
              of <Money value={budget.limit} /> · {percent}% used
            </span>
          </p>
        </div>
      </div>

      <Progress
        value={percent}
        tone={toneFor[status]}
        className="mt-4"
        label={`${budget.category}: ${percent}% of budget used`}
      />

      <p className="mt-2 text-caption font-normal">
        {status === "over" ? (
          <span className="font-semibold text-kobo-rose-ink">
            {naira(over)} over your plan — no stress, just a heads-up
          </span>
        ) : status === "limit" ? (
          <span className="font-semibold text-kobo-gold-deep">
            Budget fully used — you planned this perfectly
          </span>
        ) : (
          <span className="text-kobo-muted">
            <span className="font-semibold text-kobo-mint-ink">{naira(remaining)}</span> left to
            spend
          </span>
        )}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setExpenseOpen(true)}
          className="kobo-tap flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-kobo-teal-wash text-sm font-bold text-kobo-teal-dark transition hover:bg-kobo-teal hover:text-white"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Log expense
        </button>
        <button
          onClick={() => {
            setLimitDraft(String(budget.limit));
            setLimitOpen(true);
          }}
          aria-label={`Adjust ${budget.category} budget limit`}
          className="kobo-tap grid h-11 w-11 place-items-center rounded-full border-2 border-kobo-line bg-white text-kobo-charcoal transition hover:border-kobo-teal hover:text-kobo-teal-dark"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* Simulated expense logging */}
      <Modal
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        title={`Log ${budget.category} expense`}
      >
        <p className="mb-4 text-body text-kobo-muted">
          This is a simulation — it updates your demo budget and balance only.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[500, 1000, 2500].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                spend(budget.id, amount);
                setExpenseOpen(false);
              }}
              className="kobo-tap rounded-2xl border-2 border-kobo-line bg-white text-sm font-bold text-kobo-ink transition hover:border-kobo-teal"
            >
              {naira(amount)}
            </button>
          ))}
        </div>
      </Modal>

      {/* Adjust limit */}
      <Modal open={limitOpen} onClose={() => setLimitOpen(false)} title={`Adjust ${budget.category} limit`}>
        <label className="mb-1.5 block text-caption font-semibold text-kobo-muted" htmlFor={`limit-${budget.id}`}>
          Monthly limit (₦)
        </label>
        <input
          id={`limit-${budget.id}`}
          inputMode="numeric"
          value={limitDraft}
          onChange={(e) => setLimitDraft(e.target.value.replace(/[^\d]/g, ""))}
          className="kobo-tap w-full rounded-2xl border-2 border-kobo-line px-4 text-lg font-bold text-kobo-ink focus:border-kobo-teal focus:outline-none"
        />
        <Button
          className="mt-4 w-full"
          size="lg"
          onClick={() => {
            adjustLimit(budget.id, Number(limitDraft) || budget.limit);
            setLimitOpen(false);
          }}
        >
          Save limit
        </Button>
      </Modal>
    </motion.article>
  );
}
