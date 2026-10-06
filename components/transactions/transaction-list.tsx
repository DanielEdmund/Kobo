"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Transaction } from "@/types";
import { useKoboStore } from "@/store/kobo-store";
import { TransactionDetail, TransactionItem } from "@/components/transactions/transaction-item";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { listSlideIn } from "@/lib/tokens";

const groups = [
  { key: "today", label: "Today", match: (d: number) => d === 0 },
  { key: "yesterday", label: "Yesterday", match: (d: number) => d === 1 },
  { key: "week", label: "This Week", match: (d: number) => d >= 2 && d <= 6 },
  { key: "earlier", label: "Earlier", match: (d: number) => d > 6 },
] as const;

interface TransactionListProps {
  title?: string;
  limit?: number;
  showViewAll?: boolean;
}

/** Grouped, swipeable, animated transaction feed. */
export function TransactionList({ title = "Recent transactions", limit, showViewAll }: TransactionListProps) {
  const transactions = useKoboStore((s) => s.transactions);
  const hiddenIds = useKoboStore((s) => s.hiddenTxIds);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(
    () => transactions.filter((tx) => !hiddenIds.includes(tx.id)),
    [transactions, hiddenIds],
  );

  const sliced = useMemo(() => {
    if (limit && !expanded) return visible.slice(0, limit);
    return visible;
  }, [visible, limit, expanded]);

  const grouped = groups
    .map((group) => ({
      ...group,
      items: sliced.filter((tx) => group.match(tx.daysAgo)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section aria-labelledby="transactions-heading">
      <SectionTitle
        id="transactions-heading"
        title={title}
        subtitle="Swipe a row: right to categorize, left to hide"
        action={
          showViewAll && !expanded ? (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>
              View all
            </Button>
          ) : undefined
        }
      />

      <div className="kobo-card overflow-hidden p-1.5">
        <AnimatePresence initial={false}>
          {grouped.map((group) => (
            <motion.div
              key={group.key}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-1"
            >
              <p className="px-3 pb-1 pt-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-kobo-muted">
                {group.label}
              </p>
              <motion.ul layout className="space-y-1">
                <AnimatePresence initial={false}>
                  {group.items.map((tx) => (
                    <motion.li
                      key={tx.id}
                      variants={listSlideIn}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -30, height: 0, transition: { duration: 0.25 } }}
                      layout
                    >
                      <TransactionItem tx={tx} onOpen={setSelected} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </motion.div>
          ))}
        </AnimatePresence>

        {grouped.length === 0 && (
          <p className="px-4 py-10 text-center text-body text-kobo-muted">
            No transactions to show — demo data only.
          </p>
        )}
      </div>

      <TransactionDetail tx={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
