import {
  ArrowLeftRight,
  BadgeCheck,
  Bus,
  CalendarCheck,
  CalendarClock,
  ChartPie,
  Coins,
  Flag,
  Flame,
  Gift,
  Laptop,
  Lock,
  Percent,
  PiggyBank,
  PartyPopper,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  Umbrella,
  UtensilsCrossed,
  Wallet,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import type { InsightTone } from "@/types";

/** Central icon map — keeps every screen visually consistent. */

export const categoryIcons: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Bus,
  "Airtime/Data": Smartphone,
  Shopping: ShoppingBag,
  Bills: ReceiptText,
  Transfer: ArrowLeftRight,
  Income: Wallet,
  Savings: PiggyBank,
};

export const budgetIcons: Record<string, LucideIcon> = {
  food: UtensilsCrossed,
  transport: Bus,
  data: Smartphone,
  shopping: ShoppingBag,
  bills: ReceiptText,
};

export const goalIcons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  party: PartyPopper,
  laptop: Laptop,
  gift: Gift,
};

export const insightIcons: Record<string, LucideIcon> = {
  trending: TrendingDown,
  target: Target,
  bus: Bus,
  laptop: Laptop,
  calendar: CalendarClock,
  coins: Coins,
};

export const achievementIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  flame: Flame,
  target: Target,
  badge: BadgeCheck,
  coins: Coins,
  calendar: CalendarCheck,
  trophy: Trophy,
};

export const articleIcons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  pie: ChartPie,
  coins: Coins,
  umbrella: Umbrella,
  flag: Flag,
  percent: Percent,
  lock: Lock,
};

/** Icon tile background/text classes per semantic tone. */
export const toneTile: Record<InsightTone | string, string> = {
  teal: "bg-kobo-teal-wash text-kobo-teal-dark",
  gold: "bg-kobo-gold-soft text-kobo-gold-deep",
  coral: "bg-kobo-coral-soft text-kobo-coral-deep",
  mint: "bg-kobo-mint text-kobo-mint-ink",
  rose: "bg-kobo-rose-soft text-kobo-rose-ink",
  charcoal: "bg-black/5 text-kobo-charcoal",
};

export const toneText: Record<InsightTone | string, string> = {
  teal: "text-kobo-teal-dark",
  gold: "text-kobo-gold-deep",
  coral: "text-kobo-coral-deep",
  mint: "text-kobo-mint-ink",
  rose: "text-kobo-rose-ink",
  charcoal: "text-kobo-charcoal",
};

/** Semantic tone per transaction/budget category (used for icon tiles). */
export const categoryTone: Record<string, InsightTone | "charcoal"> = {
  Food: "teal",
  Transport: "coral",
  "Airtime/Data": "gold",
  Shopping: "rose",
  Bills: "charcoal",
  Transfer: "coral",
  Income: "mint",
  Savings: "teal",
};
