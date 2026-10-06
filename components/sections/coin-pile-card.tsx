"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useKoboStore } from "@/store/kobo-store";
import { CoinStack } from "@/components/shared/coin-burst";

/**
 * Coin pile — every save stacks a coin, every spend gives a gentle shake.
 * Purely a visual simulation of the prototype's mock actions.
 */
export function CoinPileCard() {
  const spendShake = useKoboStore((s) => s.spendShake);
  const savedCount = useKoboStore((s) =>
    s.transactions.filter((t) => t.category === "Savings").length,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby="coinpile-heading"
      className="kobo-card flex items-center gap-4 p-5"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-kobo-gold-soft text-kobo-gold-deep">
        <Coins className="h-5 w-5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <h2 id="coinpile-heading" className="text-title text-kobo-ink">
          Your coin stack
        </h2>
        <p className="mt-0.5 text-caption font-normal text-kobo-muted">
          {savedCount > 0
            ? `${savedCount} save${savedCount > 1 ? "s" : ""} recorded this session. The stack reacts whenever money moves.`
            : "Add to a goal and your stack will grow."}
        </p>
      </div>

      <CoinStack shakeKey={spendShake} />
    </motion.section>
  );
}
