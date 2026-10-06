"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/types";
import { insightIcons, toneTile, toneText } from "@/components/shared/icon-map";
import { cn } from "@/lib/utils";

/**
 * Smart insight card — helpful, contextual, beginner-friendly.
 * Never shames the user for spending.
 */
export function InsightCard({ insight, index = 0 }: { insight: Insight; index?: number }) {
  const Icon = insightIcons[insight.icon];

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="kobo-card flex flex-col p-5"
    >
      <div className="flex items-start gap-3">
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", toneTile[insight.tone])}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-[0.98rem] font-bold leading-snug text-kobo-ink">{insight.title}</h3>
          <p className="mt-1 text-caption font-normal leading-relaxed text-kobo-muted">
            {insight.body}
          </p>
        </div>
      </div>

      <Link
        href={insight.action.href}
        className={cn(
          "mt-4 inline-flex h-11 items-center justify-center gap-1.5 self-start rounded-full px-4 text-sm font-bold transition hover:gap-2.5",
          "bg-kobo-cream-deep text-kobo-charcoal hover:bg-kobo-teal hover:text-white",
          toneText[insight.tone] && "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-kobo-teal/25",
        )}
      >
        {insight.action.label}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </motion.article>
  );
}
