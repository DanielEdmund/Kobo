"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Plus, RefreshCw, Wallet } from "lucide-react";
import { useKoboStore, savingsProgress, totalSavings } from "@/store/kobo-store";
import { Money } from "@/components/shared/money";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { naira } from "@/lib/utils";

/**
 * Balance header — warm teal treatment, hide/show balance with eye toggle,
 * available · savings · total at a glance.
 */
export function BalanceHeader() {
  const available = useKoboStore((s) => s.availableBalance);
  const goals = useKoboStore((s) => s.goals);
  const hidden = useKoboStore((s) => s.balanceHidden);
  const toggleHidden = useKoboStore((s) => s.toggleBalanceHidden);
  const refreshing = useKoboStore((s) => s.refreshing);
  const refresh = useKoboStore((s) => s.refresh);
  const addMoney = useKoboStore((s) => s.addMoney);

  const [addOpen, setAddOpen] = useState(false);

  const savings = totalSavings(goals);
  const total = available + savings;
  const progress = savingsProgress(goals);

  return (
    <section
      aria-labelledby="balance-heading"
      className="relative overflow-hidden rounded-blob bg-kobo-teal-dark p-5 text-white shadow-teal sm:p-6"
    >
      {/* Soft decorative circles — calm, not gradient-heavy */}
      <span className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/10" aria-hidden />
      <span className="pointer-events-none absolute -left-10 bottom-[-3rem] h-32 w-32 rounded-full bg-kobo-teal/40" aria-hidden />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-sm font-bold text-white">
            AN
          </span>
          <div>
            <h1 id="balance-heading" className="text-title leading-tight">
              Good morning, Adaobi
            </h1>
            <p className="text-caption font-medium text-white/75">Here is your account overview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            aria-label="Refresh dashboard"
            className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <RefreshCw
              className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden
            />
          </button>
          <button
            onClick={toggleHidden}
            aria-label={hidden ? "Show balances" : "Hide balances"}
            aria-pressed={hidden}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={hidden ? "hidden" : "shown"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {hidden ? (
                  <EyeOff className="h-5 w-5" aria-hidden />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center gap-2">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-white/70">
            Available to spend
          </p>
          <span className="rounded-pill bg-white/20 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide">
            Demo
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-end gap-3">
          <p className="text-display text-white">
            <Money value={available} decimals="always" animated />
          </p>
          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1 text-caption font-bold text-white/90">
            <Wallet className="h-3.5 w-3.5" aria-hidden />
            Payday in 3 days
          </span>
        </div>
      </div>

      {/* Savings + total */}
      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/12 p-3.5 backdrop-blur-[2px]">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-white/70">Savings</p>
          <p className="mt-0.5 text-[1.15rem] font-bold">
            <Money value={savings} />
          </p>
        </div>
        <div className="rounded-2xl bg-white/12 p-3.5 backdrop-blur-[2px]">
          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-white/70">Total</p>
          <p className="mt-0.5 text-[1.15rem] font-bold">
            <Money value={total} />
          </p>
        </div>
      </div>

      {/* Overall savings progress */}
      <div className="relative mt-4">
        <div className="mb-1.5 flex items-center justify-between text-caption">
          <span className="font-semibold text-white/85">Overall savings progress</span>
          <span className="font-bold text-kobo-gold">{progress}%</span>
        </div>
        <Progress
          value={progress}
          tone="gold"
          className="bg-white/20"
          barClassName="shadow-gold"
          label={`Overall savings progress ${progress}%`}
        />
      </div>

      <button
        onClick={() => setAddOpen(true)}
        className="relative mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 text-sm font-bold text-white transition hover:bg-white/20"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add money (demo)
      </button>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add money (simulation)">
        <p className="mb-4 text-body text-kobo-muted">
          This adds fake money to your demo balance — nothing moves in or out of any bank.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[1_000, 5_000, 10_000].map((amount) => (
            <button
              key={amount}
              onClick={() => {
                addMoney(amount);
                setAddOpen(false);
              }}
              className="kobo-tap rounded-2xl border-2 border-kobo-line bg-white text-sm font-bold text-kobo-ink transition hover:border-kobo-teal hover:text-kobo-teal-dark"
            >
              {naira(amount)}
            </button>
          ))}
        </div>
      </Modal>
    </section>
  );
}
