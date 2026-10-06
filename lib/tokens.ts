import type { Transition, Variants } from "framer-motion";

/**
 * Kobo animation tokens — restrained and predictable.
 * Motion confirms state changes; it never competes with the content.
 */

export const KoboDurations = {
  fast: 0.16,
  base: 0.24,
  page: 0.18,
  celebrate: 0.3,
  coin: 0.4,
} as const;

/** Short ease-out used for cards, list items and numbers. */
export const springSoft: Transition = { duration: KoboDurations.base, ease: [0.22, 1, 0.36, 1] };
/** Slightly stronger accent for one-off confirmations. */
export const springBouncy: Transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };
/** Calm, confident easing for financial counters. */
export const easeOutExpo: Transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

/** Page transitions: a simple cross-fade — no lateral sliding. */
export const pageVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const pageTransition: Transition = {
  duration: KoboDurations.page,
  ease: "easeOut",
};

/** Modal: small scale from center + backdrop fade. */
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.99, y: 4 },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Staggered children — lists, grids, quick actions. */
export const staggerContainer = (stagger = 0.04, delayChildren = 0.02): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springSoft },
};

export const scaleInItem: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: springSoft },
};

/** Slide-in for newly added transactions. */
export const listSlideIn: Variants = {
  hidden: { opacity: 0, x: -8, height: 0 },
  visible: { opacity: 1, x: 0, height: "auto", transition: springSoft },
};
