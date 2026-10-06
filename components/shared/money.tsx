"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useKoboStore } from "@/store/kobo-store";
import { naira, cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/shared/animated-number";

interface MoneyProps {
  value: number;
  decimals?: "always" | "auto";
  className?: string;
  /** prefix for signed display, e.g. "+" / "−" */
  sign?: "+" | "−" | "";
  ariaLabel?: string;
  /** roll the number smoothly when the value changes */
  animated?: boolean;
}

/**
 * MoneyDisplay — renders ₦ amounts and animates to •••••••• when
 * the user hides their balances.
 */
export function Money({ value, decimals = "auto", className, sign = "", ariaLabel, animated }: MoneyProps) {
  const hidden = useKoboStore((s) => s.balanceHidden);
  const format = (v: number) => `${sign}${naira(v, { decimals })}`;

  return (
    <span
      className={cn("relative inline-flex tabular-nums", className)}
      aria-label={hidden ? "Balance hidden" : ariaLabel ?? `${sign}${naira(value, { decimals })}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {hidden ? (
          <motion.span
            key="masked"
            initial={{ opacity: 0, filter: "blur(6px)", scale: 1.06 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)", scale: 0.96 }}
            transition={{ duration: 0.28 }}
            aria-hidden
          >
            ••••••••
          </motion.span>
        ) : (
          <motion.span
            key="value"
            initial={{ opacity: 0, filter: "blur(6px)", scale: 0.96 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)", scale: 1.04 }}
            transition={{ duration: 0.28 }}
            className="tabular-nums"
          >
            {animated ? (
              <AnimatedNumber
                value={value}
                format={(v) => format(v)}
                ariaLabel={format(value)}
              />
            ) : (
              format(value)
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
