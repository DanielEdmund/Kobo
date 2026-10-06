import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

/** Consistent section heading across every screen. */
export function SectionTitle({ title, subtitle, action, className, id }: SectionTitleProps) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-[1.15rem] font-bold leading-tight text-kobo-ink">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-caption font-normal text-kobo-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
