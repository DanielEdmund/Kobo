"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coins,
  GraduationCap,
  House,
  PieChart,
  Send,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/", Icon: House },
  { label: "Save", href: "/save", Icon: Wallet },
  { label: "Send", href: "/send", Icon: Send },
  { label: "Budget", href: "/budget", Icon: PieChart },
  { label: "Profile", href: "/profile", Icon: User },
];

export const desktopNav: NavItem[] = [
  { label: "Insights", href: "/insights", Icon: Coins },
  { label: "Learn", href: "/learn", Icon: GraduationCap },
];

export function KoboLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-kobo-teal text-white shadow-teal">
        <Coins className="h-5 w-5" aria-hidden />
      </span>
      {!compact && (
        <span className="text-[1.25rem] font-bold tracking-tight text-kobo-ink">
          Kobo
        </span>
      )}
    </span>
  );
}

/** Desktop / large-screen sidebar navigation. */
export function Sidebar() {
  const pathname = usePathname();
  const items = [...mainNav.slice(0, 3), desktopNav[0], mainNav[3], desktopNav[1], mainNav[4]];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-kobo-line bg-surface/90 px-4 py-6 backdrop-blur lg:flex">
      <Link href="/" aria-label="Kobo home" className="px-2">
        <KoboLogo />
      </Link>

      <p className="mt-1 px-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-kobo-muted">
        Understand · Budget · Save
      </p>

      <nav aria-label="Main navigation" className="mt-7 flex flex-1 flex-col gap-1.5">
        {items.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-14 items-center gap-3 rounded-2xl px-4 text-[0.95rem] font-semibold transition",
                active
                  ? "bg-kobo-teal-wash text-kobo-teal-dark"
                  : "text-kobo-charcoal hover:bg-kobo-cream-deep/70",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-y-2 -left-4 w-1.5 rounded-r-full bg-kobo-teal"
                />
              )}
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-card border border-kobo-gold/40 bg-kobo-gold-soft/60 p-4">
        <p className="text-caption font-bold text-kobo-gold-deep">Demo prototype</p>
        <p className="mt-1 text-[0.78rem] font-normal leading-relaxed text-kobo-charcoal">
          All balances, transactions and goals are mock data. No real money moves.
        </p>
      </div>
    </aside>
  );
}

/** Mobile bottom navigation — Home · Save · Send · Budget · Profile. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-kobo-line bg-surface/95 backdrop-blur-lg lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {mainNav.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.68rem] font-bold transition",
                  active ? "text-kobo-teal-dark" : "text-kobo-muted",
                )}
              >
                <span className="relative grid h-8 w-12 place-items-center">
                  {active && (
                    <motion.span
                      layoutId="bottomnav-active"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute inset-0 rounded-pill bg-kobo-teal-wash"
                    />
                  )}
                  <Icon className={cn("relative h-5 w-5", active && "text-kobo-teal-dark")} aria-hidden />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
