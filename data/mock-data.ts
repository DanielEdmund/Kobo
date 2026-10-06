import type {
  Achievement,
  Article,
  Budget,
  Contact,
  Insight,
  SavingsGoal,
  Streak,
  Transaction,
} from "@/types";

/**
 * ─────────────────────────────────────────────────────────────
 * KOBO DEMO DATA — 100% local mock data. No backend, no bank.
 * Every figure below is fictional and for prototype purposes only.
 * ─────────────────────────────────────────────────────────────
 */

/* ── Demo user profile ─────────────────────────────────────── */
export const mockProfile = {
  name: "Adaobi",
  age: 28,
  location: "Lagos",
  tier: "Tier 2",
  accountLimit: 500_000,
  memberSince: "6 months",
  handle: "@adaobi.kobo",
  email: "adaobi@demo.kobo.app",
  phone: "+234 ••• ••• 4102",
  isDemo: true as const,
};

/* ── Balances (mock) ───────────────────────────────────────── */
export const initialAvailableBalance = 24_350;

/* ── Savings goals (mock) ──────────────────────────────────── */
export const mockGoals: SavingsGoal[] = [
  {
    id: "emergency",
    name: "Emergency Fund",
    icon: "shield",
    saved: 50_000,
    target: 100_000,
    status: "On track!",
    accent: "teal",
  },
  {
    id: "december",
    name: "December Detty",
    icon: "party",
    saved: 35_000,
    target: 50_000,
    status: "42 days to go",
    accent: "gold",
  },
  {
    id: "laptop",
    name: "New Laptop",
    icon: "laptop",
    saved: 45_000,
    target: 200_000,
    status: "Slow and steady",
    accent: "coral",
  },
  {
    id: "parents",
    name: "Parents' Gift",
    icon: "gift",
    saved: 26_780,
    target: 30_000,
    status: "Almost there!",
    accent: "mint",
  },
];

/* ── Budgets (mock) ────────────────────────────────────────── */
export const mockBudgets: Budget[] = [
  { id: "food", category: "Food", icon: "food", limit: 20_000, spent: 18_500 },
  { id: "transport", category: "Transport", icon: "transport", limit: 15_000, spent: 12_000 },
  { id: "data", category: "Airtime/Data", icon: "data", limit: 5_000, spent: 4_200 },
  { id: "shopping", category: "Shopping", icon: "shopping", limit: 10_000, spent: 11_200 },
  { id: "bills", category: "Bills", icon: "bills", limit: 25_000, spent: 25_000 },
];

/* ── Transactions (34 mock entries, ₦50 – ₦25,000) ────────── */
export const mockTransactions: Transaction[] = [
  // Today
  { id: "t01", merchant: "Jollof Spot", category: "Food", type: "expense", amount: 450, daysAgo: 0, time: "1:24 PM", note: "Lunch with Tolu" },
  { id: "t02", merchant: "Transfer to Mum", category: "Transfer", type: "transfer", amount: 3_000, daysAgo: 0, time: "11:40 AM", note: "Weekly support" },
  { id: "t03", merchant: "Bolt", category: "Transport", type: "expense", amount: 1_200, daysAgo: 0, time: "9:05 AM", note: "Yaba → VI" },
  { id: "t04", merchant: "MTN Airtime", category: "Airtime/Data", type: "expense", amount: 500, daysAgo: 0, time: "8:12 AM" },
  { id: "t05", merchant: "Roadside Popcorn", category: "Food", type: "expense", amount: 150, daysAgo: 0, time: "7:48 AM" },

  // Yesterday
  { id: "t06", merchant: "Shoprite", category: "Shopping", type: "expense", amount: 4_750, daysAgo: 1, time: "7:30 PM", note: "Weekly groceries" },
  { id: "t07", merchant: "DStv Subscription", category: "Bills", type: "expense", amount: 3_500, daysAgo: 1, time: "2:20 PM" },
  { id: "t08", merchant: "Mega Chicken", category: "Food", type: "expense", amount: 1_850, daysAgo: 1, time: "12:50 PM" },
  { id: "t09", merchant: "Danfo Card Top-up", category: "Transport", type: "expense", amount: 300, daysAgo: 1, time: "8:30 AM" },

  // This week
  { id: "t10", merchant: "Salary — Bloom Studios", category: "Income", type: "income", amount: 25_000, daysAgo: 2, time: "10:00 AM", note: "Monthly pay" },
  { id: "t11", merchant: "Jumia", category: "Shopping", type: "expense", amount: 6_900, daysAgo: 2, time: "6:12 PM" },
  { id: "t12", merchant: "Ikeja Electric", category: "Bills", type: "expense", amount: 4_000, daysAgo: 2, time: "11:15 AM", note: "Prepaid units" },
  { id: "t13", merchant: "Netflix", category: "Bills", type: "expense", amount: 4_400, daysAgo: 3, time: "9:02 AM" },
  { id: "t14", merchant: "Uber", category: "Transport", type: "expense", amount: 1_650, daysAgo: 3, time: "5:45 PM" },
  { id: "t15", merchant: "Chicken Republic", category: "Food", type: "expense", amount: 2_300, daysAgo: 3, time: "1:35 PM" },
  { id: "t16", merchant: "Airtel Data Bundle", category: "Airtime/Data", type: "expense", amount: 1_000, daysAgo: 4, time: "8:05 AM" },
  { id: "t17", merchant: "Konga", category: "Shopping", type: "expense", amount: 3_200, daysAgo: 4, time: "4:28 PM" },
  { id: "t18", merchant: "Jumia Refund", category: "Shopping", type: "refund", amount: 1_500, daysAgo: 4, time: "10:44 AM", note: "Returned item" },
  { id: "t19", merchant: "Chinedu — Aneke", category: "Transfer", type: "income", amount: 5_000, daysAgo: 5, time: "3:19 PM", note: "Shared dinner split" },
  { id: "t20", merchant: "OgaPeters Kitchen", category: "Food", type: "expense", amount: 1_200, daysAgo: 5, time: "2:05 PM" },
  { id: "t21", merchant: "Spotify Premium", category: "Bills", type: "expense", amount: 900, daysAgo: 5, time: "9:30 AM" },
  { id: "t22", merchant: "GOtv Subscription", category: "Bills", type: "expense", amount: 1_900, daysAgo: 6, time: "6:40 PM" },
  { id: "t23", merchant: "Slot Nigeria", category: "Shopping", type: "expense", amount: 12_500, daysAgo: 6, time: "12:15 PM", note: "Phone accessories" },
  { id: "t24", merchant: "inDriver", category: "Transport", type: "expense", amount: 950, daysAgo: 6, time: "8:55 AM" },

  // Earlier
  { id: "t25", merchant: "Rent Support — Dad", category: "Transfer", type: "income", amount: 15_000, daysAgo: 7, time: "5:02 PM" },
  { id: "t26", merchant: "Filmhouse Cinema", category: "Shopping", type: "expense", amount: 4_500, daysAgo: 7, time: "7:15 PM" },
  { id: "t27", merchant: "The Place Restaurant", category: "Food", type: "expense", amount: 3_600, daysAgo: 7, time: "1:10 PM" },
  { id: "t28", merchant: "Total Energies", category: "Transport", type: "expense", amount: 5_000, daysAgo: 8, time: "4:50 PM", note: "Fuel" },
  { id: "t29", merchant: "Steam", category: "Shopping", type: "expense", amount: 6_200, daysAgo: 8, time: "10:35 PM" },
  { id: "t30", merchant: "9mobile Data", category: "Airtime/Data", type: "expense", amount: 750, daysAgo: 8, time: "7:55 AM" },
  { id: "t31", merchant: "Alaro Market", category: "Food", type: "expense", amount: 3_400, daysAgo: 9, time: "11:25 AM" },
  { id: "t32", merchant: "Transfer to Sis Ify", category: "Transfer", type: "transfer", amount: 2_500, daysAgo: 9, time: "6:20 PM" },
  { id: "t33", merchant: "Google One", category: "Bills", type: "expense", amount: 2_900, daysAgo: 10, time: "9:18 AM" },
  { id: "t34", merchant: "Mr Bigg's", category: "Food", type: "expense", amount: 1_650, daysAgo: 11, time: "2:40 PM" },
  { id: "t35", merchant: "AliExpress", category: "Shopping", type: "expense", amount: 8_900, daysAgo: 12, time: "8:47 PM" },
  { id: "t36", merchant: "Sweet Sensation", category: "Food", type: "expense", amount: 2_100, daysAgo: 13, time: "1:05 PM" },
];

/* ── Smart insights (5+ mock, never judgemental) ───────────── */
export const mockInsights: Insight[] = [
  {
    id: "i1",
    title: "You spent 20% less on food this week.",
    body: "Nice one! That's about ₦3,700 kept in your pocket compared to last week. Small changes really do add up.",
    tone: "teal",
    icon: "trending",
    action: { label: "Learn More", href: "/learn" },
  },
  {
    id: "i2",
    title: "You're close to your savings goal!",
    body: "Parents' Gift is at 89%. About ₦3,220 more and it's done — you could finish it this month.",
    tone: "gold",
    icon: "target",
    action: { label: "Open Goal", href: "/save" },
  },
  {
    id: "i3",
    title: "Your transport spending increased this week.",
    body: "You've used ₦12,000 of your ₦15,000 transport budget. Nothing to worry about — just worth a look.",
    tone: "coral",
    icon: "bus",
    action: { label: "Adjust Budget", href: "/budget" },
  },
  {
    id: "i4",
    title: "Reach your laptop goal faster.",
    body: "Saving an extra ₦2,000 this week would bring New Laptop forward by about 3 weeks.",
    tone: "gold",
    icon: "laptop",
    action: { label: "Learn More", href: "/learn" },
  },
  {
    id: "i5",
    title: "Rent is due in 5 days.",
    body: "Good news — you've already covered this month's bills category in full. You're prepared.",
    tone: "mint",
    icon: "calendar",
    action: { label: "View Budget", href: "/budget" },
  },
  {
    id: "i6",
    title: "Round-ups added ₦1,240 this month.",
    body: "Spare change from everyday spending is quietly building your Emergency Fund.",
    tone: "teal",
    icon: "coins",
    action: { label: "Open Goal", href: "/save" },
  },
];

/* ── Achievements ──────────────────────────────────────────── */
export const mockAchievements: Achievement[] = [
  { id: "a1", name: "First Save", description: "Made your very first save.", icon: "sparkles", unlocked: true, unlockedLabel: "Unlocked 6 months ago" },
  { id: "a2", name: "7-Day Saver", description: "Saved something every day for a week.", icon: "flame", unlocked: true, unlockedLabel: "Unlocked last week" },
  { id: "a3", name: "Goal Starter", description: "Started your first savings goal.", icon: "target", unlocked: true, unlockedLabel: "Unlocked 5 months ago" },
  { id: "a4", name: "Round-Up Rookie", description: "Collected your first round-ups.", icon: "coins", unlocked: true, unlockedLabel: "Unlocked this month" },
  { id: "a5", name: "Budget Boss", description: "Stay under budget in every category for a month.", icon: "badge", unlocked: false },
  { id: "a6", name: "Consistent Saver", description: "Save for 30 days in a row.", icon: "calendar", unlocked: false },
  { id: "a7", name: "Goal Crusher", description: "Complete a savings goal in full.", icon: "trophy", unlocked: false },
];

/* ── Savings streak ────────────────────────────────────────── */
export const mockStreak: Streak = {
  days: 7,
  savedToday: false,
  nextMilestone: 30,
  week: [
    { label: "Mon", day: "16", done: true },
    { label: "Tue", day: "17", done: true },
    { label: "Wed", day: "18", done: true },
    { label: "Thu", day: "19", done: true },
    { label: "Fri", day: "20", done: true },
    { label: "Sat", day: "21", done: true },
    { label: "Sun", day: "22", done: true },
  ],
};

/* ── Round-ups (mock) ──────────────────────────────────────── */
export const mockRoundUp = {
  monthlyTotal: 1_240,
  demoSpend: 450,
  demoRoundUp: 50,
  demoTotal: 500,
  goalName: "Emergency Fund",
};

/* ── Contacts for the send-money flow (simulated) ──────────── */
export const mockContacts: Contact[] = [
  { id: "c1", name: "Mum", initials: "MU", bank: "GTBank", handle: "••4102", recent: true },
  { id: "c2", name: "Chinedu", initials: "CH", bank: "Access Bank", handle: "••7781", recent: true },
  { id: "c3", name: "Sis Ify", initials: "SI", bank: "Zenith", handle: "••2290", recent: true },
  { id: "c4", name: "Tolu Designs", initials: "TD", bank: "Kuda", handle: "••0054" },
  { id: "c5", name: "Eze", initials: "EZ", bank: "UBA", handle: "••3312" },
  { id: "c6", name: "Amaka", initials: "AM", bank: "Wema", handle: "••9910" },
];

/* ── Learn / financial literacy (mock content) ─────────────── */
export const mockArticles: Article[] = [
  {
    id: "l1",
    title: "How to Build Your First Emergency Fund",
    description: "A calm, step-by-step plan for creating a small safety net — even on a tight budget.",
    category: "Emergency Funds",
    minutes: 5,
    progress: 50,
    icon: "shield",
  },
  {
    id: "l2",
    title: "The 50/30/20 Rule, Simplified",
    description: "Split your income into needs, wants and savings without doing any hard maths.",
    category: "Budgeting",
    minutes: 6,
    progress: 0,
    icon: "pie",
  },
  {
    id: "l3",
    title: "Why Round-Ups Make Saving Painless",
    description: "How spare change from everyday spending quietly builds your savings.",
    category: "Saving",
    minutes: 4,
    progress: 100,
    icon: "coins",
  },
  {
    id: "l4",
    title: "Needs vs Wants: A Kind Look at Spending",
    description: "No guilt, no lecture — just a simple way to see where your money actually goes.",
    category: "Spending",
    minutes: 5,
    progress: 25,
    icon: "umbrella",
  },
  {
    id: "l5",
    title: "Setting Money Goals You'll Actually Reach",
    description: "Turn a vague 'I want to save' into a clear goal with a date and a number.",
    category: "Money Goals",
    minutes: 4,
    progress: 0,
    icon: "flag",
  },
  {
    id: "l6",
    title: "What Interest Actually Means for Your Savings",
    description: "Plain-English explanation of how savings interest grows your money over time.",
    category: "Understanding Interest",
    minutes: 7,
    progress: 0,
    icon: "percent",
  },
  {
    id: "l7",
    title: "Staying Safe with Digital Money",
    description: "Five simple habits that keep your money and your accounts protected.",
    category: "Digital Finance Safety",
    minutes: 6,
    progress: 0,
    icon: "lock",
  },
];

export const mockQuiz = {
  id: "q1",
  question: "Which of these counts as a real emergency?",
  options: [
    { id: "o1", label: "A flat tyre on your way to an interview", correct: true },
    { id: "o2", label: "A friend's surprise birthday party", correct: false },
    { id: "o3", label: "The new phone everyone is talking about", correct: false },
  ],
  explanation:
    "An emergency is unexpected and necessary — something that affects your safety, health or livelihood. Everything else is a plan you can save for.",
};

/* ── Mock chart data (local only) ──────────────────────────── */
export const mockWeeklySpend = [
  { day: "Mon", amount: 3_200 },
  { day: "Tue", amount: 1_850 },
  { day: "Wed", amount: 4_750 },
  { day: "Thu", amount: 2_300 },
  { day: "Fri", amount: 6_900 },
  { day: "Sat", amount: 4_150 },
  { day: "Sun", amount: 2_700 },
];

export const mockSavingsGrowth = [
  { month: "Apr", savings: 42_000 },
  { month: "May", savings: 61_500 },
  { month: "Jun", savings: 78_000 },
  { month: "Jul", savings: 96_400 },
  { month: "Aug", savings: 124_000 },
  { month: "Sep", savings: 156_780 },
];

export const mockCategorySplit = [
  { name: "Food", value: 18_500, fill: "#0D9488" },
  { name: "Transport", value: 12_000, fill: "#334155" },
  { name: "Airtime/Data", value: 4_200, fill: "#F59E0B" },
  { name: "Shopping", value: 11_200, fill: "#94A3B8" },
  { name: "Bills", value: 25_000, fill: "#0F766E" },
];

/* ── Friendly money tips ───────────────────────────────────── */
export const mockTips = [
  "Save before you spend, not after. Future you says thank you.",
  "A budget isn't a restriction — it's a plan you choose.",
  "Missed a goal date? Adjust it. Goals should serve you, not stress you.",
  "Round-ups are invisible saving: ₦50 here, ₦50 there, suddenly it's ₦1,240.",
];
