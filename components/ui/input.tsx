import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "kobo-tap w-full rounded-2xl border-2 border-kobo-line bg-white px-4 text-base text-kobo-ink placeholder:text-kobo-muted/70 transition-colors focus:border-kobo-teal focus:outline-none focus-visible:ring-4 focus-visible:ring-kobo-teal/25",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
