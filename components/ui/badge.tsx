import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-caption font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        teal: "bg-kobo-teal-wash text-kobo-teal-dark ring-1 ring-kobo-teal/25",
        mint: "bg-kobo-mint text-kobo-mint-ink ring-1 ring-kobo-mint-deep",
        gold: "bg-kobo-gold-soft text-kobo-gold-deep ring-1 ring-kobo-gold/40",
        coral: "bg-kobo-coral-soft text-kobo-coral-deep ring-1 ring-kobo-coral/30",
        rose: "bg-kobo-rose-soft text-kobo-rose-ink ring-1 ring-kobo-rose/50",
        neutral: "bg-black/5 text-kobo-muted ring-1 ring-black/5",
        demo: "bg-kobo-ink text-kobo-cream ring-1 ring-kobo-ink/20",
      },
    },
    defaultVariants: { variant: "teal" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
