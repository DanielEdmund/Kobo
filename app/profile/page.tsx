"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, GraduationCap, MapPin, RotateCcw, User } from "lucide-react";
import { mockProfile } from "@/data/mock-data";
import { useKoboStore, totalSavings } from "@/store/kobo-store";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AchievementsSection } from "@/components/sections/sections";
import { Money } from "@/components/shared/money";
import { SectionTitle } from "@/components/shared/section-title";
import { naira, percentOf } from "@/lib/utils";

export default function ProfilePage() {
  const available = useKoboStore((s) => s.availableBalance);
  const goals = useKoboStore((s) => s.goals);
  const balanceHidden = useKoboStore((s) => s.balanceHidden);
  const toggleBalanceHidden = useKoboStore((s) => s.toggleBalanceHidden);
  const roundUpsOn = useKoboStore((s) => s.roundUpsOn);
  const toggleRoundUps = useKoboStore((s) => s.toggleRoundUps);
  const reducedMotion = useKoboStore((s) => s.reducedMotion);
  const setReducedMotion = useKoboStore((s) => s.setReducedMotion);
  const resetDemo = useKoboStore((s) => s.resetDemo);

  const total = available + totalSavings(goals);
  const limitPercent = percentOf(total, mockProfile.accountLimit);

  return (
    <div className="space-y-6">
      {/* Identity */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-labelledby="profile-heading"
        className="kobo-card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left"
      >
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-kobo-teal text-3xl font-bold text-white shadow-teal">
          A
        </span>
        <div className="min-w-0 flex-1">
          <h1 id="profile-heading" className="text-headline text-kobo-ink">
            {mockProfile.name}
          </h1>
          <p className="text-caption font-normal text-kobo-muted">
            {mockProfile.handle} · {mockProfile.age} ·{" "}
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {mockProfile.location}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge variant="teal">{mockProfile.tier}</Badge>
            <Badge variant="gold">Member for {mockProfile.memberSince}</Badge>
            <Badge variant="coral">Demo profile</Badge>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account card */}
        <section aria-labelledby="account-heading" className="kobo-card p-5">
          <SectionTitle
            id="account-heading"
            title="Demo account"
            subtitle="Mock figures for this prototype"
          />

          <div className="rounded-xl bg-kobo-slate-wash p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-caption font-semibold text-kobo-muted">Total balance</span>
              <span className="text-xl font-bold text-kobo-ink">
                <Money value={total} />
              </span>
            </div>
            <div className="mt-3 mb-1.5 flex items-center justify-between text-caption">
              <span className="font-semibold text-kobo-muted">
                {mockProfile.tier} limit: {naira(mockProfile.accountLimit)}
              </span>
              <span className="font-bold text-kobo-teal-dark">{limitPercent}% used</span>
            </div>
            <Progress value={limitPercent} tone="teal" label="Account limit usage" />
            <p className="mt-3 text-[0.78rem] font-normal leading-relaxed text-kobo-muted">
              {mockProfile.email} · {mockProfile.phone}
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-kobo-rose-soft p-3.5 text-caption font-semibold text-kobo-rose-ink">
            <User className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Identity verification (KYC), bank links and real account limits are intentionally not
            part of this frontend mock.
          </div>
        </section>

        {/* Preferences */}
        <section aria-labelledby="prefs-heading" className="kobo-card p-5">
          <SectionTitle
            id="prefs-heading"
            title="Preferences"
            subtitle="You're in control of what you see"
          />
          <div className="divide-y divide-kobo-line">
            <Switch
              checked={balanceHidden}
              onChange={toggleBalanceHidden}
              label="Hide balances"
              description="Show •••••••• instead of amounts"
            />
            <Switch
              checked={roundUpsOn}
              onChange={toggleRoundUps}
              label="Round-ups"
              description="Collect spare change into savings"
              tone="gold"
            />
            <Switch
              checked={reducedMotion}
              onChange={() => setReducedMotion(!reducedMotion)}
              label="Reduced motion"
              description="Calmer transitions across the app"
              tone="coral"
            />
          </div>

          <button
            onClick={resetDemo}
            className="kobo-tap mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-kobo-line bg-white text-sm font-bold text-kobo-charcoal transition hover:border-kobo-coral hover:text-kobo-coral-deep"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset demo data
          </button>
        </section>
      </div>

      {/* Quick links for larger-screen features */}
      <section aria-labelledby="explore-heading">
        <SectionTitle id="explore-heading" title="Explore more" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/insights"
            className="kobo-tap flex items-center gap-3 rounded-card border border-kobo-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-kobo-teal-wash text-kobo-teal-dark">
              <Coins className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-title text-kobo-ink">Insights</span>
              <span className="block text-caption font-normal text-kobo-muted">
                Charts and gentle observations
              </span>
            </span>
          </Link>

          <Link
            href="/learn"
            className="kobo-tap flex items-center gap-3 rounded-card border border-kobo-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-kobo-gold-soft text-kobo-gold-deep">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-title text-kobo-ink">Learn</span>
              <span className="block text-caption font-normal text-kobo-muted">
                Money lessons for beginners
              </span>
            </span>
          </Link>
        </div>
      </section>

      <AchievementsSection />

      {/* Honest about being a mock */}
      <section aria-labelledby="about-heading" className="rounded-card border border-kobo-coral/30 bg-kobo-coral-soft/60 p-5">
        <h2 id="about-heading" className="text-title text-kobo-ink">
          About this prototype
        </h2>
        <p className="mt-2 text-body text-kobo-charcoal">
          Kobo is a frontend-only product mock. It contains no real banking, payments, KYC,
          transfers, cards, investments or notifications — every number you see is local demo data
          stored in your browser session.
        </p>
        <p className="mt-2 text-caption font-semibold text-kobo-teal-dark">
          Every kobo counts. Every small step matters.
        </p>
      </section>
    </div>
  );
}
