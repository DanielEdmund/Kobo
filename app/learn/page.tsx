"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { LearnCategory } from "@/types";
import { useKoboStore } from "@/store/kobo-store";
import { ArticleCard, QuizCard } from "@/components/learn/learn-ui";
import { FinancialTip } from "@/components/sections/financial-tip";
import { AchievementsSection } from "@/components/sections/sections";
import { cn } from "@/lib/utils";

const categories: (LearnCategory | "All")[] = [
  "All",
  "Saving",
  "Budgeting",
  "Spending",
  "Emergency Funds",
  "Money Goals",
  "Understanding Interest",
  "Digital Finance Safety",
];

export default function LearnPage() {
  const articles = useKoboStore((s) => s.articles);
  const [active, setActive] = useState<LearnCategory | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? articles : articles.filter((a) => a.category === active)),
    [articles, active],
  );

  const completed = articles.filter((a) => a.progress === 100).length;

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-card border border-kobo-teal/25 bg-kobo-teal-wash p-6"
      >
        <span className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-kobo-teal/10" aria-hidden />
        <span className="inline-flex items-center gap-2 rounded-pill bg-kobo-teal px-3 py-1 text-[0.72rem] font-bold uppercase tracking-wide text-white">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden />
          Learn
        </span>
        <h1 className="mt-3 text-headline text-kobo-ink">Money, explained simply</h1>
        <p className="mt-1 max-w-2xl text-body text-kobo-muted">
          Short, jargon-free lessons for first-time savers. {completed} of {articles.length}{" "}
          completed — go at your own pace.
        </p>
      </motion.header>

      {/* Category filter */}
      <div
        role="tablist"
        aria-label="Lesson categories"
        className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {categories.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={active === category}
            onClick={() => setActive(category as LearnCategory | "All")}
            className={cn(
              "h-11 shrink-0 rounded-full px-4 text-caption font-bold transition",
              active === category
                ? "bg-kobo-teal text-white shadow-teal"
                : "bg-surface text-kobo-charcoal ring-1 ring-kobo-line hover:ring-kobo-teal",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
          ) : (
            <div className="kobo-card grid place-items-center p-10 text-center">
              <p className="text-body text-kobo-muted">
                Nothing here yet — try another category.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <QuizCard />
          <FinancialTip />
        </div>
      </div>

      <AchievementsSection title="Learning & saving badges" />
    </div>
  );
}
