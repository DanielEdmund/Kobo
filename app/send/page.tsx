"use client";

import { motion } from "framer-motion";
import { SendFlow } from "@/components/send/send-flow";
import { FinancialTip } from "@/components/sections/financial-tip";

export default function SendPage() {
  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-caption font-semibold uppercase tracking-[0.14em] text-kobo-muted">
          Simulated peer-to-peer transfer
        </p>
        <h1 className="mt-1 text-headline text-kobo-ink">Send money</h1>
        <p className="mx-auto mt-1 max-w-md text-body text-kobo-muted">
          Five friendly steps: pick a contact, enter an amount, confirm, celebrate, keep the
          receipt. No real transfer ever happens.
        </p>
      </motion.header>

      <SendFlow />

      <div className="mx-auto max-w-lg">
        <FinancialTip />
      </div>
    </div>
  );
}
