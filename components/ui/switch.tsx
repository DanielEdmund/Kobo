"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  tone?: "teal" | "gold" | "coral";
  className?: string;
}

/** Satisfying toggle used for Round-Ups and preferences. */
export function Switch({ checked, onChange, label, description, tone = "teal", className }: SwitchProps) {
  const trackOn =
    tone === "gold" ? "bg-kobo-gold" : tone === "coral" ? "bg-kobo-coral" : "bg-kobo-teal";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={description ? `${label}. ${description}` : label}
      onClick={onChange}
      className={cn(
        "group flex min-h-[56px] w-full items-center justify-between gap-4 rounded-2xl px-1 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-kobo-teal/25",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-title text-kobo-ink">{label}</span>
        {description && (
          <span className="block text-caption font-normal text-kobo-muted">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 items-center rounded-pill p-1 transition-colors duration-300",
          checked ? trackOn : "bg-black/15",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={cn(
            "h-6 w-6 rounded-full bg-white shadow-card",
            checked ? "ml-auto" : "ml-0",
          )}
        />
      </span>
    </button>
  );
}
