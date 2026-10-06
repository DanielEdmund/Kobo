"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Shuffle } from "lucide-react";
import { mockTips } from "@/data/mock-data";

/** Encouraging money tips — rotate through friendly, jargon-free advice. */
export function FinancialTip() {
  const [index, setIndex] = useState(0);

  return (
    <section
      aria-label="Money tip"
      className="kobo-card flex items-start gap-3 border-kobo-gold/30 bg-kobo-gold-soft/50 p-4"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-kobo-gold-soft text-kobo-gold-deep">
        <Lightbulb className="h-5 w-5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-kobo-gold-deep">
          Money tip
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-caption font-normal leading-relaxed text-kobo-charcoal"
          >
            {mockTips[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIndex((i) => (i + 1) % mockTips.length)}
        aria-label="Show another money tip"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-kobo-charcoal shadow-card transition hover:text-kobo-teal-dark"
      >
        <Shuffle className="h-4 w-4" aria-hidden />
      </button>
    </section>
  );
}
