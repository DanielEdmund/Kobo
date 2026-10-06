"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Info, X } from "lucide-react";
import { BottomNav, Sidebar } from "@/components/layout/navigation";
import { Toaster } from "@/components/ui/toast";
import { CelebrationModal, MilestoneBurst } from "@/components/shared/celebration";
import { CoinBurst } from "@/components/shared/coin-burst";
import { pageTransition, pageVariants } from "@/lib/tokens";
import { useKoboStore } from "@/store/kobo-store";

/** Persistent demo-data notice — the prototype is honest about being a mock. */
function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-kobo-line bg-kobo-gold-soft"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-[0.78rem] font-medium text-kobo-gold-deep">
            <Info className="h-4 w-4 shrink-0" aria-hidden />
            <p className="min-w-0 flex-1">
              Demo prototype — every figure, transaction and chart is mock data. No real money moves.
            </p>
            <Link href="/profile" className="hidden underline underline-offset-2 sm:inline">
              About
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss demo notice"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition hover:bg-kobo-gold/20"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** App shell: sidebar (lg+), bottom nav (mobile), page transitions, overlays. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useKoboStore((s) => s.reducedMotion);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <div className="min-h-screen bg-canvas">
        <Sidebar />

        <div className="lg:pl-64">
          <DemoBanner />

          <main
            id="main-content"
            className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:pb-12 lg:pt-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <BottomNav />

        {/* Global feedback layers */}
        <Toaster />
        <CoinBurst />
        <MilestoneBurst />
        <CelebrationModal />
      </div>
    </MotionConfig>
  );
}
