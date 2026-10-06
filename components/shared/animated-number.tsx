"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Controlled rolling counter for financial numbers.
 * Calm easing, never excessively fast — numbers stay readable.
 */
export function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toLocaleString("en-NG"),
  duration = 0.8,
  className,
  ariaLabel,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    if (reduce) {
      current.current = value;
      setDisplay(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, duration, reduce]);

  return (
    <span className={className} aria-label={ariaLabel ?? format(value)}>
      {format(display)}
    </span>
  );
}
