"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Info, Sparkles, TriangleAlert } from "lucide-react";
import { useKoboStore } from "@/store/kobo-store";
import { cn } from "@/lib/utils";

const toneMap = {
  teal: { className: "bg-kobo-ink text-white", Icon: BadgeCheck },
  gold: { className: "bg-kobo-gold text-kobo-ink", Icon: Sparkles },
  coral: { className: "bg-kobo-coral text-white", Icon: Info },
  rose: { className: "bg-kobo-rose-deep text-white", Icon: TriangleAlert },
} as const;

/** Lightweight toast feedback — every mock action responds immediately. */
export function Toaster() {
  const toasts = useKoboStore((s) => s.toasts);
  const dismiss = useKoboStore((s) => s.dismissToast);

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-8 lg:left-auto lg:right-8 lg:items-end lg:px-0"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const { className, Icon } = toneMap[toast.tone];
          return (
            <motion.button
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={() => dismiss(toast.id)}
              className={cn(
                "pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-2xl px-4 py-3 text-left text-sm font-semibold shadow-lift",
                className,
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{toast.message}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
