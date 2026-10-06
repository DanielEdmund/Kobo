"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-kobo-teal/30 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        /* Primary — Trust Teal */
        primary:
          "bg-kobo-teal text-white shadow-teal hover:bg-kobo-teal-deep active:scale-[0.97]",
        /* High-energy CTA — Energetic Coral */
        coral:
          "bg-kobo-coral text-white shadow-coral hover:bg-kobo-coral-deep active:scale-[0.97]",
        /* Celebration — Savings Gold */
        gold: "bg-kobo-gold text-kobo-ink shadow-gold hover:bg-kobo-gold-deep active:scale-[0.97]",
        soft: "bg-kobo-mint text-kobo-mint-ink hover:bg-kobo-mint-deep active:scale-[0.97]",
        outline:
          "border-2 border-kobo-line bg-white text-kobo-charcoal hover:border-kobo-teal hover:text-kobo-teal-dark active:scale-[0.97]",
        ghost: "text-kobo-charcoal hover:bg-kobo-cream-deep active:scale-[0.97]",
        danger: "bg-kobo-rose-soft text-kobo-rose-ink hover:bg-kobo-rose/60 active:scale-[0.97]",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-7 text-base",
        icon: "h-12 w-12 rounded-full",
        /* Minimum 56px touch target */
        tap: "h-14 w-full px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
