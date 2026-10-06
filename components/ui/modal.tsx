"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { backdropVariants, modalVariants } from "@/lib/tokens";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** bottom sheet on mobile, centered modal on larger screens */
  variant?: "sheet" | "center";
  className?: string;
}

/** Kobo modal — scale from center + backdrop fade (mobile sheet on small screens). */
export function Modal({ open, onClose, title, children, variant = "sheet", className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.button
            aria-label="Close"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-kobo-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={cn(
              "relative z-10 max-h-[88vh] w-full overflow-y-auto border border-kobo-line bg-surface p-5 shadow-lift",
              variant === "center"
                ? "rounded-card sm:max-w-md sm:p-6"
                : "rounded-t-blob sm:rounded-card sm:max-w-md sm:p-6",
              className,
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-title text-kobo-ink">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/5 text-kobo-muted transition hover:bg-black/10 hover:text-kobo-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
