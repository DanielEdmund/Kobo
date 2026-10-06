# Kobo — Frontend Mock Prototype

> **Every kobo counts. Every small step matters.**

Kobo is a **frontend-only prototype** of a personal-finance platform designed to help everyday
Nigerians understand, organize, save, budget and grow their money through micro-savings,
round-ups, budgeting and financial literacy.

It is a **UI/UX mock**, not a production financial application. Every figure, transaction,
chart and interaction is **local mock data** rendered in the browser.

---

## 1. Core message

> "Money management doesn't have to be scary. Small steps add up."

The experience revolves around one journey:

**Understand → Budget → Save → Track → Learn → Grow**

| Journey step | Where it lives |
| --- | --- |
| Understand | Home balance header, Insights charts |
| Budget | `/budget` — category budgets with safe/warning/over states |
| Save | `/save` — goals, quick-adds, round-ups, streaks |
| Track | Transaction feed (grouped, swipeable) on Home |
| Learn | `/learn` — lessons, progress, quizzes |
| Grow | Achievements, streaks, milestones, insights |

---

## 2. Frontend mock only — what is intentionally NOT built

No real: banking APIs · payment processing · bank connections · transfers · deposits/withdrawals ·
authentication · KYC · card payments · institution integrations · investments · credit ·
notifications · real-time data · backend · database.

Everything above is **simulated in the frontend**:

- **Add money** → updates the local mock balance
- **Save** → updates a local savings goal + triggers coin animation
- **Round-up** → simulates spare change moving into a goal
- **Send** → simulated confirmation + fake receipt with generated reference
- **Budget** → updates local spending values (log demo expense, adjust limits)
- **Insights** → predefined/mock insight cards
- **Achievements** → simulated unlock with celebration
- **Transactions** → local mock list (36 seeded + session-generated entries)
- **Charts** → local mock datasets (Recharts)
- **Learn** → local educational content with progress in state
- **Profile** → local mock account information
- **Hide balance** → masks every amount as ••••••••
- **Refresh** → animated demo-data refresh

A persistent coral banner, "Demo" chips, and receipts labelled *simulated* keep the mock nature
visible at all times.

---

## 3. Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 14 (App Router)** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** with a Kobo design-token layer |
| UI components | **shadcn/ui-style** primitives (`components/ui/*`, built on CVA) |
| Animation | **Framer Motion** |
| Icons | **Lucide React** |
| Charts | **Recharts** |
| State | **Zustand** (single `KoboStore`, no backend) |
| Forms | **React Hook Form + Zod** (send-money amount validation) |

---

## 4. Architecture

```text
app/
├── layout.tsx              Root layout: skip-link, AppShell, metadata
├── globals.css             Tokens, base styles, component utilities, reduced-motion
├── page.tsx                Home dashboard
├── save/page.tsx           Savings goals, growth chart, round-ups, streak
├── budget/page.tsx         Category budgets + summary + chart
├── insights/page.tsx       All insights + donut/bar/area charts
├── learn/page.tsx          Lessons, filters, quiz
├── send/page.tsx           Simulated P2P send-money flow
└── profile/page.tsx        Demo profile, preferences, achievements

components/
├── ui/          Button, Card, Badge, Progress, Input, Switch, Modal, Toaster (CVA-based)
├── layout/      AppShell (page transitions), Sidebar, BottomNav, DemoBanner, logo
├── shared/      Money, AnimatedNumber, ProgressRing, CoinBurst, celebration, charts, icons
├── sections/    Reusable dashboard sections (goals, insights, achievements, budget overview)
├── home/        BalanceHeader, QuickActions, RoundUpBanner, StreakCard
├── save/        GoalCard
├── budget/      BudgetCard
├── transactions/ TransactionItem (swipe), TransactionList, TransactionDetail
├── insights/    InsightCard
├── learn/       ArticleCard, QuizCard
├── send/        SendFlow (5 steps)
└── achievements/ AchievementBadge + grid

lib/             utils.ts (cn, ₦ formatting) · tokens.ts (motion tokens, variants)
data/            mock-data.ts — every mock entity in one place
store/           kobo-store.ts — Zustand store + derived selectors
types/           Shared TS domain types
```

### State model (`store/kobo-store.ts`)

One Zustand store holds all prototype state: balances, goals, budgets, transactions,
achievements, articles, streak, round-up totals, toasts and celebration/milestone/coin events.
Actions are pure simulations that mutate local state and emit immediate feedback (toast,
animation event, celebration). Derived values (`totalSavings`, `savingsProgress`,
`budgetStatus`) are exported helpers, so nothing is stored twice.

Nothing is persisted to a server or `localStorage` — a reload returns to seed data, which keeps
the prototype deterministic.

### Mock-data approach (`data/mock-data.ts`)

- Demo profile: **Adaobi, 28, Lagos, Tier 2, ₦500,000 limit, member 6 months**
- Balances: **₦24,350 available · ₦156,780 savings · ₦181,130 total**
- 4 goals: Emergency Fund (₦50k/₦100k), December Detty (₦35k/₦50k), New Laptop (₦45k/₦200k),
  Parents' Gift (₦26,780/₦30k) — percentages are **computed**, never hardcoded
- **36 transactions** (₦150–₦25,000) mixing Nigerian merchants (Bolt, Shoprite, Jumia, MTN,
  DStv, Ikeja Electric, Mega Chicken, GOtv…) with international ones (Netflix, Spotify,
  AliExpress, Google One, Steam)
- 5 budgets exactly as specified (Shopping over, Bills at limit)
- 6 insights, 7 achievements, 7 lessons, 1 quiz, 6 contacts, 3 chart datasets, 4 money tips

Transactions store `daysAgo` + a fixed `time` label instead of raw `Date` objects so
server/client rendering stays deterministic (no hydration mismatches).

---

## 5. Design tokens (Tailwind-inspired, utility-first)

Defined in `tailwind.config.ts` and consumed as ordinary utilities everywhere:

```tsx
bg-kobo-teal        // KoboColors.trustTeal   #14B8A6
bg-kobo-coral       // KoboColors.energeticCoral #F97316
bg-kobo-gold        // KoboColors.savingsGold  #FBBF24
bg-canvas           // KoboColors.cleanCream   #FEFCE8
text-kobo-ink       // grounded charcoal text
bg-kobo-mint        // positive states
text-kobo-rose-ink  // warning states

rounded-card / rounded-blob     // KoboRadius
shadow-card / shadow-lift / shadow-teal / shadow-gold   // KoboShadows
text-display / headline / title / body / caption         // KoboTypography
min-h-[56px] (.kobo-tap)       // touch targets
animate-coin-drop / pop-in / confetti-fall / shake / pulse-soft   // KoboAnimations
```

Animation timing/easing constants live in `lib/tokens.ts`
(`KoboDurations`, `springSoft`, `springBouncy`, `pageVariants`, `modalVariants`,
`staggerContainer`) — the Flutter-spec `KoboAnimations.spring` equivalent.

---

## 6. Color psychology implementation

| Token | Hex | Meaning | Where it's used |
| --- | --- | --- | --- |
| Trust Teal | `#14B8A6` | trust, clarity, growth | primary buttons, active nav, balance header, savings progress |
| Energetic Coral | `#F97316` | motivation, warmth, urgency | demo banner, Send action, alerts, CTAs |
| Savings Gold | `#FBBF24` | reward, milestones, celebration | achievements, streaks, round-ups, confetti |
| Clean Cream | `#FEFCE8` | simplicity, comfort | page background, breathing room |
| Grounded Charcoal | `#374151` | stability, readability | headings, financial numbers, body |
| Soft Mint | `#D1FAE5` | safety, positive states | income, "on track", confirmations |
| Alert Rose | `#FDA4AF` | attention, risk awareness | over-budget, warnings, low-balance |

### Emotional design goals in practice

- **Financial confidence** — big readable numbers, plain language, no jargon.
- **Approachability** — one idea per card; no dense dashboards.
- **Small wins** — +₦100 quick-adds trigger the same coin celebration as ₦1,000; milestones at
  25/50/75/100%.
- **Transparency** — every amount can be traced to a transaction or a mock source; "demo" labels
  everywhere.
- **Encouragement** — copy never scolds: *"Shopping is over its demo limit. Spending isn't
  failure, it's information."*

---

## 7. Animation strategy (Framer Motion as the "Framer Motion reference")

- **Page transitions**: `AnimatePresence mode="wait"` in `AppShell` — enter from right + fade,
  exit left + fade (~380ms, `easeOutExpo`-style curve).
- **Modals**: scale from centre + backdrop fade (`modalVariants`), bottom-sheet on mobile.
- **Numbers**: `AnimatedNumber` rolls values with `animate()` on a calm 0.8s expo curve;
  `Money` cross-fades to `••••••••` with a blur when balance is hidden.
- **Coins**: falling + bounce + rotation-varied coins and a floating `+₦500` indicator on every
  save/round-up (`CoinBurst`).
- **Spending**: `CoinStack` gives a subtle shake; over-budget cards animate a gentle shake.
- **Progress**: spring-based ring/bars with a slight overshoot; gold pulse at 85–99%.
- **Celebrations**: trophy scale-in, dashed spinning rays, gold confetti (deterministic pieces),
  typing-style toast — kept polished and brief (~3s).
- **Streaks**: calendar days flip in, fire pulses, counter pops with a coral colour transition.
- **Reduced motion**: `MotionConfig reducedMotion` wired to a user preference switch, plus a
  CSS `prefers-reduced-motion` guard.

All confetti/spread values are computed from fixed formulas (never `Math.random()` during
render) so SSR and client output match.

---

## 8. Responsive design

- **Mobile (primary)**: bottom navigation `Home · Save · Send · Budget · Profile`, full-width
  summaries, 56px touch targets, bottom sheets, swipe transactions, pull-to-refresh strip,
  FAB-like quick actions.
- **Tablet (`md`)**: two-column goal/budget/insight grids, wider transaction rows.
- **Desktop (`lg`)**: persistent sidebar with all seven destinations
  (`Home · Save · Send · Budget · Insights · Learn · Profile`), 2/3 + 1/3 dashboard with a side
  panel (streak, chart, tip) — not a stretched mobile layout.

---

## 9. Accessibility

- Minimum **56px** touch targets (`.kobo-tap`, `min-h-[56px]`)
- **Status never relies on colour alone** — every budget state pairs icon + text
  (`StatusPill`: check/clock/alert + "On track"/"Almost there"/"Over budget")
- Screen-reader labels on balances, progressbars, switches, transaction rows and toggles
- Skip-to-content link, visible focus rings, `aria-current` navigation, `role=alert` form errors
- High-contrast financial numbers (charcoal/white on cream/teal)
- Reduced-motion switch + `prefers-reduced-motion` media query

---

## 10. Running the prototype

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checks + lints)
npm run start
```

### Things to try

1. Tap the **eye icon** in the balance header — every amount becomes ••••••••.
2. Hit **+₦500** on Parents' Gift — coins fall, the bar jumps, a milestone pops.
3. Fill Parents' Gift to ₦30,000 — gold confetti + **Goal Complete!** + a Goal Crusher unlock.
4. Tap **Round Up** (quick action or banner) — spare change flows into the jar.
5. Swipe a transaction **right** to categorize, **left** to hide/report; tap for details.
6. On `/budget`, log an expense in Shopping — watch the rose "over budget" state shake in.
7. On `/send`, try sending more than your balance — Zod validation catches it.
8. Tap a **locked achievement** — badge unlock celebration.
9. Toggle **Reduced motion** in Profile — animations calm down.

---

## 11. Brand personality

Friendly · warm · simple · encouraging · modern · trustworthy · empowering · Nigerian · human.
Rounded but controlled cards, warm cream backgrounds, teal foundations, coral action points,
gold celebrations, mint positive states, rose warning states, generous spacing, simple
visualisations — a modern friendly finance product, never a cold banking dashboard.
