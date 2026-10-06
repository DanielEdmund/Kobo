"use client";

import { ReactNode } from "react";

/**
 * Shared page wrapper — consistent rhythm + staggered entrance for every screen.
 */
export function PageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`space-y-6 ${className}`}>{children}</section>;
}
