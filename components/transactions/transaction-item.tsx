"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, EyeOff, Flag, Tags } from "lucide-react";
import type { Transaction } from "@/types";
import { categoryIcons, categoryTone, toneTile } from "@/components/shared/icon-map";
import { signedNaira, cn, timeAgo } from "@/lib/utils";
import { useKoboStore } from "@/store/kobo-store";

const toneByType: Record<Transaction["type"], string> = {
  income: "bg-kobo-mint text-kobo-mint-ink",
  refund: "bg-kobo-teal-wash text-kobo-teal-dark",
  expense: "bg-kobo-cream-deep text-kobo-charcoal",
  transfer: "bg-kobo-coral-soft text-kobo-coral-deep",
};

interface TransactionItemProps {
  tx: Transaction;
  onOpen: (tx: Transaction) => void;
}

/**
 * Friendly transaction row with swipe interactions:
 * swipe right → Categorize · swipe left → Hide / Report
 * (tap also opens details for accessibility).
 */
export function TransactionItem({ tx, onOpen }: TransactionItemProps) {
  const recategorize = useKoboStore((s) => s.recategorizeTransaction);
  const hide = useKoboStore((s) => s.hideTransaction);
  const [snapped, setSnapped] = useState<"left" | "right" | null>(null);

  const Icon = categoryIcons[tx.category] ?? ArrowLeftRight;
  const positive = tx.type === "income" || tx.type === "refund";

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Left action (revealed on right swipe): Categorize */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 flex w-32 items-center justify-center gap-2 rounded-l-2xl bg-kobo-teal text-white",
          snapped === "right" ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <Tags className="h-5 w-5" />
        <span className="text-caption font-bold">Categorize</span>
      </div>

      {/* Right action (revealed on left swipe): Hide / Report */}
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-36 items-center justify-center gap-2 rounded-r-2xl bg-kobo-rose-deep text-white",
          snapped === "left" ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <EyeOff className="h-5 w-5" />
        <Flag className="h-4 w-4" />
        <span className="text-caption font-bold">Hide / Report</span>
      </div>

      <motion.button
        type="button"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.22}
        dragMomentum={false}
        whileTap={{ scale: 0.99 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 90) {
            setSnapped("right");
            recategorize(tx.id);
            window.setTimeout(() => setSnapped(null), 900);
          } else if (info.offset.x < -90) {
            setSnapped("left");
            hide(tx.id);
            window.setTimeout(() => setSnapped(null), 900);
          }
        }}
        onClick={() => onOpen(tx)}
        aria-label={`${tx.merchant}, ${tx.category}, ${signedNaira(tx.amount, tx.type)}, ${timeAgo(
          tx.daysAgo,
        )} ${tx.time}. Tap for details.`}
        className="relative flex w-full cursor-grab items-center gap-3 bg-surface px-3 py-3 text-left transition-colors hover:bg-kobo-cream/60 active:cursor-grabbing"
      >
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
            toneByType[tx.type],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[0.95rem] font-semibold text-kobo-ink">
              {tx.merchant}
            </span>
            {tx.simulated && (
              <span className="shrink-0 rounded-pill bg-kobo-ink px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-kobo-cream">
                Demo
              </span>
            )}
          </span>
          <span className="block truncate text-caption font-normal text-kobo-muted">
            {tx.category} · {timeAgo(tx.daysAgo) === "Today" ? "Today" : timeAgo(tx.daysAgo)} ·{" "}
            {tx.time}
          </span>
        </span>

        <span
          className={cn(
            "shrink-0 text-[0.95rem] font-bold tabular-nums",
            positive ? "text-kobo-teal-dark" : "text-kobo-ink",
          )}
        >
          {signedNaira(tx.amount, tx.type)}
        </span>
      </motion.button>
    </div>
  );
}

interface TransactionDetailProps {
  tx: Transaction | null;
  onClose: () => void;
}

export function TransactionDetail({ tx, onClose }: TransactionDetailProps) {
  const recategorize = useKoboStore((s) => s.recategorizeTransaction);
  const pushToast = useKoboStore((s) => s.pushToast);

  return (
    <AnimatePresence>
      {tx && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.button
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-kobo-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Transaction details"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative z-10 w-full rounded-t-blob border border-kobo-line bg-surface p-6 shadow-lift sm:max-w-sm sm:rounded-card"
          >
            {(() => {
              const Icon = categoryIcons[tx.category] ?? ArrowLeftRight;
              const positive = tx.type === "income" || tx.type === "refund";
              return (
                <>
                  <div className="flex flex-col items-center text-center">
                    <span
                      className={cn(
                        "grid h-16 w-16 place-items-center rounded-3xl",
                        toneTile[categoryTone[tx.category] ?? "charcoal"],
                      )}
                    >
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                    <h3 className="mt-3 text-title text-kobo-ink">{tx.merchant}</h3>
                    <p className="text-caption font-normal text-kobo-muted">
                      {tx.category} · {tx.time}
                    </p>
                    <p
                      className={cn(
                        "mt-3 text-display",
                        positive ? "text-kobo-teal-dark" : "text-kobo-ink",
                      )}
                    >
                      {signedNaira(tx.amount, tx.type)}
                    </p>
                  </div>

                  <dl className="mt-5 space-y-2 rounded-2xl bg-kobo-cream/70 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-kobo-muted">When</dt>
                      <dd className="font-semibold text-kobo-ink">
                        {timeAgo(tx.daysAgo)} · {tx.time}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-kobo-muted">Category</dt>
                      <dd className="font-semibold text-kobo-ink">{tx.category}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-kobo-muted">Note</dt>
                      <dd className="font-semibold text-kobo-ink">{tx.note ?? "—"}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-kobo-muted">Data source</dt>
                      <dd className="font-semibold text-kobo-coral-deep">Demo / mock data</dd>
                    </div>
                  </dl>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        pushToast("Split is a demo interaction — nothing was divided", "coral");
                        onClose();
                      }}
                      className="kobo-tap rounded-full border-2 border-kobo-line bg-white text-[0.82rem] font-bold text-kobo-charcoal transition hover:border-kobo-teal"
                    >
                      Split
                    </button>
                    <button
                      onClick={() => {
                        recategorize(tx.id);
                        onClose();
                      }}
                      className="kobo-tap rounded-full border-2 border-kobo-line bg-white text-[0.82rem] font-bold text-kobo-charcoal transition hover:border-kobo-teal"
                    >
                      Categorize
                    </button>
                    <button
                      onClick={onClose}
                      className="kobo-tap rounded-full bg-kobo-teal text-[0.82rem] font-bold text-white shadow-teal"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
