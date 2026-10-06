"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useKoboStore } from "@/store/kobo-store";
import { naira } from "@/lib/utils";

/**
 * Brief, single-line acknowledgement when money moves into savings —
 * one floating amount chip that fades in and out. No falling objects.
 */
export function CoinBurst() {
  const burst = useKoboStore((s) => s.coinBurst);

  return (
    <AnimatePresence>
      {burst && (
        <div
          key={burst.id}
          className="pointer-events-none fixed inset-x-0 bottom-28 z-[58] flex justify-center lg:bottom-16"
          aria-hidden
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-pill bg-kobo-ink px-4 py-2 text-sm font-semibold text-white shadow-lift"
          >
            +{naira(burst.amount)} saved
          </motion.span>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * A small stack of coins that gives a short shake whenever money is spent —
 * a tactile cue that value moved, with no lingering motion.
 */
export function CoinStack({ shakeKey }: { shakeKey: number }) {
  return (
    <div key={shakeKey} className="flex items-end gap-1" aria-hidden>
      {[0.55, 0.8, 1].map((scale, i) => (
        <span
          key={i}
          className={`block rounded-full bg-kobo-gold ring-2 ring-kobo-gold-deep/30 ${
            shakeKey > 0 ? "animate-shake" : ""
          }`}
          style={{
            width: 26 * scale,
            height: 12 * scale,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}
