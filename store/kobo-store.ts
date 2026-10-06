"use client";

import { create } from "zustand";
import {
  initialAvailableBalance,
  mockAchievements,
  mockArticles,
  mockBudgets,
  mockGoals,
  mockInsights,
  mockRoundUp,
  mockStreak,
  mockTransactions,
} from "@/data/mock-data";
import type {
  Achievement,
  Article,
  Budget,
  BudgetStatus,
  MilestoneEvent,
  SavingsGoal,
  Streak,
  Toast,
  Transaction,
} from "@/types";

/**
 * KoboStore — all prototype state lives here.
 * Everything is simulated locally; nothing touches a backend or a bank.
 */

export interface Receipt {
  id: string;
  recipientName: string;
  recipientBank: string;
  recipientHandle: string;
  amount: number;
  reference: string;
  time: string;
}

export function budgetStatus(budget: Budget): BudgetStatus {
  const ratio = budget.spent / budget.limit;
  if (ratio > 1) return "over";
  if (ratio >= 1) return "limit";
  if (ratio >= 0.85) return "warning";
  return "safe";
}

export const statusMeta: Record<
  BudgetStatus,
  { label: string; tone: string; icon: "check" | "alert" | "clock" }
> = {
  safe: { label: "On track", tone: "teal", icon: "check" },
  warning: { label: "Almost there", tone: "gold", icon: "clock" },
  limit: { label: "At limit", tone: "gold", icon: "clock" },
  over: { label: "Over budget", tone: "rose", icon: "alert" },
};

interface KoboState {
  /* UI */
  balanceHidden: boolean;
  roundUpsOn: boolean;
  reducedMotion: boolean;
  refreshing: boolean;
  hiddenTxIds: string[];

  /* Money (mock) */
  availableBalance: number;
  goals: SavingsGoal[];
  budgets: Budget[];
  transactions: Transaction[];
  achievements: Achievement[];
  articles: Article[];
  streak: Streak;
  insights: typeof mockInsights;
  roundUpMonthly: number;
  roundUpToday: number;

  /* Feedback events for animations */
  toasts: Toast[];
  celebration: { type: "goal" | "achievement"; title: string; subtitle: string } | null;
  milestone: MilestoneEvent | null;
  coinBurst: { id: number; goalId: string; amount: number } | null;
  spendShake: number;
  receipt: Receipt | null;

  /* Actions */
  toggleBalanceHidden: () => void;
  toggleRoundUps: () => void;
  setReducedMotion: (value: boolean) => void;
  refresh: () => void;

  addToGoal: (goalId: string, amount: number) => void;
  addMoney: (amount: number) => void;
  simulateRoundUp: () => void;
  spendFromBudget: (budgetId: string, amount: number) => void;
  adjustBudgetLimit: (budgetId: string, limit: number) => void;
  recordTransfer: (receipt: Omit<Receipt, "id" | "reference" | "time">) => Receipt;
  hideTransaction: (id: string) => void;
  recategorizeTransaction: (id: string) => void;
  completeArticle: (id: string) => void;
  completeQuiz: () => void;
  saveToday: () => void;
  unlockAchievement: (id: string) => void;
  resetDemo: () => void;

  pushToast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: number) => void;
  clearCelebration: () => void;
  clearMilestone: () => void;
  clearCoinBurst: () => void;
}

const initialState = {
  balanceHidden: false,
  roundUpsOn: true,
  reducedMotion: false,
  refreshing: false,
  hiddenTxIds: [] as string[],
  availableBalance: initialAvailableBalance,
  goals: mockGoals.map((g) => ({ ...g })),
  budgets: mockBudgets.map((b) => ({ ...b })),
  transactions: mockTransactions.map((t) => ({ ...t })),
  achievements: mockAchievements.map((a) => ({ ...a })),
  articles: mockArticles.map((a) => ({ ...a })),
  streak: { ...mockStreak, week: mockStreak.week.map((d) => ({ ...d })) },
  roundUpMonthly: mockRoundUp.monthlyTotal,
  roundUpToday: 0,
};

let toastId = 0;
let eventId = 0;

export const useKoboStore = create<KoboState>((set, get) => ({
  ...initialState,
  insights: mockInsights,

  toasts: [],
  celebration: null,
  milestone: null,
  coinBurst: null,
  spendShake: 0,
  receipt: null,

  /* ── UI toggles ──────────────────────────────────────────── */
  toggleBalanceHidden: () =>
    set((s) => ({ balanceHidden: !s.balanceHidden })),

  toggleRoundUps: () =>
    set((s) => {
      const next = !s.roundUpsOn;
      return { roundUpsOn: next };
    }),

  setReducedMotion: (value) => set({ reducedMotion: value }),

  refresh: () => {
    set({ refreshing: true });
    window.setTimeout(() => {
      set({ refreshing: false });
      get().pushToast("Dashboard refreshed — demo data is up to date", "teal");
    }, 900);
  },

  /* ── Saving money (simulated) ────────────────────────────── */
  addToGoal: (goalId, amount) => {
    const state = get();
    const goal = state.goals.find((g) => g.id === goalId);
    if (!goal || amount <= 0) return;

    if (amount > state.availableBalance) {
      get().pushToast("Not enough in your demo balance for that", "rose");
      return;
    }

    const before = Math.floor((goal.saved / goal.target) * 100);
    const saved = Math.min(goal.target, goal.saved + amount);
    const after = Math.floor((saved / goal.target) * 100);

    const goals = state.goals.map((g) => (g.id === goalId ? { ...g, saved } : g));
    const reachedGoal = saved >= goal.target;

    const tx: Transaction = {
      id: `sim-${eventId++}`,
      merchant: `Saved to ${goal.name}`,
      category: "Savings",
      type: "transfer",
      amount,
      daysAgo: 0,
      time: "Just now",
      note: "Simulated save",
      simulated: true,
    };

    set({
      availableBalance: state.availableBalance - amount,
      goals,
      transactions: [tx, ...state.transactions],
      coinBurst: { id: eventId++, goalId, amount },
    });

    /* Achievements */
    const achievements = [...state.achievements];
    const firstSave = achievements.find((a) => a.id === "a1");
    let celebrateAchievement: Achievement | null = null;
    if (firstSave && !firstSave.unlocked) {
      const idx = achievements.findIndex((a) => a.id === "a1");
      achievements[idx] = {
        ...firstSave,
        unlocked: true,
        unlockedLabel: "Unlocked just now",
      };
      celebrateAchievement = achievements[idx];
    }
    set({ achievements });

    /* Milestones: 25 / 50 / 75 / 100 */
    if (reachedGoal) {
      const crusherIdx = achievements.findIndex((a) => a.id === "a7");
      const updated = [...achievements];
      let crush: Achievement | null = null;
      if (crusherIdx >= 0 && !updated[crusherIdx].unlocked) {
        updated[crusherIdx] = {
          ...updated[crusherIdx],
          unlocked: true,
          unlockedLabel: "Unlocked just now",
        };
        crush = updated[crusherIdx];
      }
      set({
        achievements: updated,
        celebration: {
          type: "goal",
          title: "Goal complete",
          subtitle: `${goal.name} is fully funded at ${`₦${goal.target.toLocaleString("en-NG")}`}`,
        },
        milestone: { id: eventId++, goalId, percent: 100, complete: true },
      });
      if (crush) {
        window.setTimeout(() => {
          set({
            celebration: {
              type: "achievement",
              title: `Achievement unlocked: ${crush!.name}`,
              subtitle: crush!.description,
            },
          });
        }, 3200);
      }
      get().pushToast(`${goal.name} fully funded`, "gold");
    } else if (Math.floor(after / 25) > Math.floor(before / 25)) {
      set({
        milestone: { id: eventId++, goalId, percent: Math.floor(after / 25) * 25, complete: false },
      });
      get().pushToast(`${goal.name} reached ${after}%`, "gold");
      if (celebrateAchievement) {
        set({
          celebration: {
            type: "achievement",
            title: `Achievement unlocked: ${celebrateAchievement.name}`,
            subtitle: celebrateAchievement.description,
          },
        });
      }
    } else {
      get().pushToast(`+${`₦${amount.toLocaleString("en-NG")}`} added to ${goal.name}`, "teal");
      if (celebrateAchievement) {
        set({
          celebration: {
            type: "achievement",
            title: `Achievement unlocked: ${celebrateAchievement.name}`,
            subtitle: celebrateAchievement.description,
          },
        });
      }
    }

    window.setTimeout(() => get().clearCoinBurst(), 1400);
  },

  addMoney: (amount) => {
    const state = get();
    if (amount <= 0) return;
    set({ availableBalance: state.availableBalance + amount });
    get().pushToast(`Added ${`₦${amount.toLocaleString("en-NG")}`} to your demo balance`, "teal");
  },

  /* ── Round-ups (simulated spare change) ──────────────────── */
  simulateRoundUp: () => {
    const state = get();
    if (!state.roundUpsOn) {
      get().pushToast("Turn Round-Ups ON to collect spare change", "coral");
      return;
    }
    const demo = mockRoundUp.demoRoundUp; // ₦50 from the ₦450 Jollof Spot purchase
    if (demo > state.availableBalance) {
      get().pushToast("Not enough in your demo balance to round up", "rose");
      return;
    }

    const goals = state.goals.map((g) =>
      g.id === "emergency" ? { ...g, saved: g.saved + demo } : g,
    );
    const tx: Transaction = {
      id: `sim-${eventId++}`,
      merchant: "Round-up — Jollof Spot",
      category: "Savings",
      type: "transfer",
      amount: demo,
      daysAgo: 0,
      time: "Just now",
      note: "₦450 rounded up to ₦500",
      simulated: true,
    };

    set({
      availableBalance: state.availableBalance - demo,
      goals,
      transactions: [tx, ...state.transactions],
      roundUpMonthly: state.roundUpMonthly + demo,
      roundUpToday: state.roundUpToday + demo,
      coinBurst: { id: eventId++, goalId: "emergency", amount: demo },
    });

    /* Round-Up Rookie achievement */
    const achievements = [...state.achievements];
    const idx = achievements.findIndex((a) => a.id === "a4");
    if (idx >= 0 && !achievements[idx].unlocked) {
      achievements[idx] = { ...achievements[idx], unlocked: true, unlockedLabel: "Unlocked just now" };
      set({
        achievements,
        celebration: {
          type: "achievement",
          title: `Achievement unlocked: ${achievements[idx].name}`,
          subtitle: achievements[idx].description,
        },
      });
    }

    get().pushToast(`+₦${demo} spare change moved to your Emergency Fund`, "gold");
    window.setTimeout(() => get().clearCoinBurst(), 1400);
  },

  /* ── Budgets (simulated spending) ────────────────────────── */
  spendFromBudget: (budgetId, amount) => {
    const state = get();
    const budget = state.budgets.find((b) => b.id === budgetId);
    if (!budget || amount <= 0) return;
    if (amount > state.availableBalance) {
      get().pushToast("Not enough in your demo balance", "rose");
      return;
    }

    const spent = budget.spent + amount;
    const wasOver = budget.spent > budget.limit;
    const isOver = spent > budget.limit;
    const budgets = state.budgets.map((b) => (b.id === budgetId ? { ...b, spent } : b));

    const tx: Transaction = {
      id: `sim-${eventId++}`,
      merchant: `${budget.category} spend`,
      category: budget.category,
      type: "expense",
      amount,
      daysAgo: 0,
      time: "Just now",
      note: "Simulated expense",
      simulated: true,
    };

    set({
      budgets,
      availableBalance: state.availableBalance - amount,
      transactions: [tx, ...state.transactions],
      spendShake: eventId++,
    });

    if (isOver && !wasOver) {
      get().pushToast(`${budget.category} is over budget — no stress, just a heads-up`, "rose");
    } else {
      get().pushToast(`Logged ${`₦${amount.toLocaleString("en-NG")}`} to ${budget.category}`, "teal");
    }
  },

  adjustBudgetLimit: (budgetId, limit) => {
    const state = get();
    if (limit < 500) return;
    set({
      budgets: state.budgets.map((b) => (b.id === budgetId ? { ...b, limit } : b)),
    });
    get().pushToast("Budget adjusted — demo only", "teal");
  },

  /* ── Send money (fully simulated) ────────────────────────── */
  recordTransfer: (input) => {
    const state = get();
    const reference = `KOB-${String(100000 + Math.floor(Math.random() * 899999))}`;
    const now = new Date();
    const time = now.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });

    const receipt: Receipt = {
      ...input,
      id: `sim-${eventId++}`,
      reference,
      time,
    };

    const tx: Transaction = {
      id: receipt.id,
      merchant: `Transfer to ${input.recipientName}`,
      category: "Transfer",
      type: "transfer",
      amount: input.amount,
      daysAgo: 0,
      time: "Just now",
      note: `Ref ${reference}`,
      simulated: true,
    };

    set({
      availableBalance: Math.max(0, state.availableBalance - input.amount),
      transactions: [tx, ...state.transactions],
      receipt,
    });

    get().pushToast("Transfer simulated — no real money moved", "coral");
    return receipt;
  },

  /* ── Transactions ────────────────────────────────────────── */
  hideTransaction: (id) => {
    set((s) => ({ hiddenTxIds: [...s.hiddenTxIds, id] }));
    get().pushToast("Transaction hidden (demo)", "coral");
  },

  recategorizeTransaction: (id) => {
    get().pushToast("Category updated (demo only)", "teal");
    void id;
  },

  /* ── Learn ───────────────────────────────────────────────── */
  completeArticle: (id) => {
    const state = get();
    const article = state.articles.find((a) => a.id === id);
    if (!article) return;
    const progress = Math.min(100, article.progress + 25);
    set({
      articles: state.articles.map((a) => (a.id === id ? { ...a, progress } : a)),
    });
    if (progress === 100 && article.progress < 100) {
      get().pushToast(`"${article.title}" completed — nice!`, "gold");
    } else {
      get().pushToast(`Progress saved: ${progress}%`, "teal");
    }
  },

  completeQuiz: () => {
    get().pushToast("Quiz complete — badge added to your profile (demo)", "gold");
  },

  /* ── Streak ──────────────────────────────────────────────── */
  saveToday: () => {
    const state = get();
    if (state.streak.savedToday) {
      get().pushToast("You've already saved today — see you tomorrow!", "gold");
      return;
    }
    const days = state.streak.days + 1;
    set({
      streak: { ...state.streak, days, savedToday: true },
    });
    if (days === 30 || days === 100) {
      set({
        celebration: {
          type: "achievement",
          title: `${days}-day streak!`,
          subtitle: "A milestone worth celebrating.",
        },
      });
    }
    get().pushToast(`${days}-day saving streak — maintained`, "gold");
  },

  unlockAchievement: (id) => {
    const state = get();
    const achievement = state.achievements.find((a) => a.id === id);
    if (!achievement || achievement.unlocked) return;
    set({
      achievements: state.achievements.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedLabel: "Unlocked just now" } : a,
      ),
      celebration: {
        type: "achievement",
        title: `Achievement unlocked: ${achievement.name}`,
        subtitle: achievement.description,
      },
    });
  },

  resetDemo: () => {
    set({
      ...initialState,
      goals: mockGoals.map((g) => ({ ...g })),
      budgets: mockBudgets.map((b) => ({ ...b })),
      transactions: mockTransactions.map((t) => ({ ...t })),
      achievements: mockAchievements.map((a) => ({ ...a })),
      articles: mockArticles.map((a) => ({ ...a })),
      streak: { ...mockStreak, week: mockStreak.week.map((d) => ({ ...d })) },
      toasts: [],
      celebration: null,
      milestone: null,
      coinBurst: null,
      receipt: null,
    });
    get().pushToast("Demo data reset", "teal");
  },

  /* ── Toasts / events ─────────────────────────────────────── */
  pushToast: (message, tone = "teal") => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, tone }] }));
    window.setTimeout(() => get().dismissToast(id), 3000);
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clearCelebration: () => set({ celebration: null }),
  clearMilestone: () => set({ milestone: null }),
  clearCoinBurst: () => set({ coinBurst: null }),
}));

/* ── Derived selectors ─────────────────────────────────────── */
export function totalSavings(goals: SavingsGoal[]) {
  return goals.reduce((sum, g) => sum + g.saved, 0);
}

export function savingsProgress(goals: SavingsGoal[]) {
  const saved = totalSavings(goals);
  const target = goals.reduce((sum, g) => sum + g.target, 0);
  return target ? Math.round((saved / target) * 100) : 0;
}
