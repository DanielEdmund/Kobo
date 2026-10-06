"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, Trophy } from "lucide-react";
import type { Article } from "@/types";
import { mockQuiz } from "@/data/mock-data";
import { useKoboStore } from "@/store/kobo-store";
import { articleIcons, toneTile } from "@/components/shared/icon-map";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, seeded } from "@/lib/utils";

const toneCycle = ["teal", "gold", "coral", "mint", "rose"] as const;

/** Article card with thumbnail, reading time and progress. */
export function ArticleCard({ article, index }: { article: Article; index: number }) {
  const complete = useKoboStore((s) => s.completeArticle);
  const [open, setOpen] = useState(false);
  const Icon = articleIcons[article.icon];
  const tone = toneCycle[index % toneCycle.length];
  const done = article.progress === 100;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="kobo-card flex flex-col overflow-hidden"
      >
        {/* Thumbnail / illustration */}
        <div
          className={cn(
            "relative flex h-28 items-end justify-between overflow-hidden p-4",
            toneTile[tone],
          )}
        >
          <span
            className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/40"
            aria-hidden
          />
          <span
            className="absolute right-8 top-6 h-10 w-10 rounded-full bg-white/50"
            aria-hidden
          />
          <Icon className="relative h-10 w-10" aria-hidden />
          <span className="relative inline-flex items-center gap-1 rounded-pill bg-white/85 px-2.5 py-1 text-[0.7rem] font-bold text-kobo-charcoal">
            <Clock className="h-3 w-3" aria-hidden />
            {article.minutes} min read
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <Badge variant={done ? "mint" : "neutral"} className="mb-2 self-start">
            {article.category}
          </Badge>
          <h3 className="text-[0.98rem] font-bold leading-snug text-kobo-ink">{article.title}</h3>
          <p className="mt-1 flex-1 text-caption font-normal leading-relaxed text-kobo-muted">
            {article.description}
          </p>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[0.72rem] font-bold">
              <span className="text-kobo-muted">
                {done ? "Completed" : article.progress > 0 ? `${article.progress}% complete` : "Not started"}
              </span>
              {done && <CheckCircle2 className="h-4 w-4 text-kobo-teal" aria-hidden />}
            </div>
            <Progress value={article.progress} tone={done ? "mint" : "teal"} label={`${article.title} progress`} />
          </div>

          <button
            onClick={() => setOpen(true)}
            className="kobo-tap mt-4 inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-kobo-cream-deep text-sm font-bold text-kobo-charcoal transition hover:bg-kobo-teal hover:text-white"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            {done ? "Read again" : article.progress > 0 ? "Continue" : "Start reading"}
          </button>
        </div>
      </motion.article>

      <Modal open={open} onClose={() => setOpen(false)} title={article.title}>
        <div className="space-y-3 text-body text-kobo-charcoal">
          <Badge variant="neutral">{article.category}</Badge>
          <p>
            Most people think managing money means doing something dramatic. It doesn&apos;t.
            It starts with one small, repeatable habit.
          </p>
          <p>
            In this lesson we&apos;ll walk through it step by step, in plain language, using
            examples that look like real everyday life in Nigeria — from market runs to data
            bundles to that monthly salary that always seems to disappear.
          </p>
          <div className="rounded-2xl bg-kobo-mint p-4 text-caption font-semibold text-kobo-mint-ink">
            Key idea: small, consistent steps beat big, stressful ones. Every kobo counts.
          </div>
          <p className="text-caption text-kobo-muted">
            This is sample educational content created for the Kobo prototype.
          </p>
        </div>

        <Button
          className="mt-5 w-full"
          size="lg"
          onClick={() => {
            complete(article.id);
            if (article.progress + 25 >= 100) setOpen(false);
          }}
        >
          {article.progress >= 100 ? "Read again" : "Mark 25% progress"}
        </Button>
      </Modal>
    </>
  );
}

/** Quiz card — simple, encouraging, no trick questions. */
export function QuizCard() {
  const [selected, setSelected] = useState<string | null>(null);
  const completeQuiz = useKoboStore((s) => s.completeQuiz);
  const chosen = mockQuiz.options.find((o) => o.id === selected);
  const showResult = selected !== null;

  return (
    <section aria-labelledby="quiz-heading" className="kobo-card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-kobo-coral text-white shadow-coral">
          <Trophy className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 id="quiz-heading" className="text-title text-kobo-ink">
            Quick quiz
          </h2>
          <p className="text-caption font-normal text-kobo-muted">Earn a completion badge (demo)</p>
        </div>
      </div>

      <p className="mt-4 text-[0.98rem] font-bold text-kobo-ink">{mockQuiz.question}</p>

      <ul className="mt-3 space-y-2">
        {mockQuiz.options.map((option, i) => {
          const isSelected = selected === option.id;
          const reveal = showResult && option.correct;

          return (
            <motion.li
              key={option.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => !showResult && setSelected(option.id)}
                disabled={showResult}
                className={cn(
                  "kobo-tap flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition",
                  reveal
                    ? "border-kobo-teal bg-kobo-mint text-kobo-mint-ink"
                    : isSelected
                      ? "border-kobo-coral bg-kobo-coral-soft text-kobo-coral-deep"
                      : "border-kobo-line bg-white text-kobo-charcoal hover:border-kobo-teal",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold",
                    reveal ? "bg-kobo-teal text-white" : "bg-black/10 text-kobo-muted",
                  )}
                  aria-hidden
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {option.label}
              </button>
            </motion.li>
          );
        })}
      </ul>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl bg-kobo-cream-deep p-4">
              <p className="text-sm font-bold text-kobo-ink">
                {chosen?.correct ? "Correct" : "Not quite correct"}
              </p>
              <p className="mt-1 text-caption font-normal text-kobo-muted">
                {mockQuiz.explanation}
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => {
                  completeQuiz();
                  setSelected(null);
                }}
              >
                Claim badge & try again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Deterministic decorative dots used as a lightweight illustration. */
export function DotPattern({ seed = 3 }: { seed?: number }) {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/50"
          style={{
            left: `${Math.round(seeded(i, seed) * 96)}%`,
            top: `${Math.round(seeded(i, seed + 4) * 92)}%`,
          }}
        />
      ))}
    </span>
  );
}
