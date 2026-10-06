"use client";

import { useMemo, useState } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Delete,
  FileText,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { Contact } from "@/types";
import { mockContacts } from "@/data/mock-data";
import { useKoboStore } from "@/store/kobo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { naira } from "@/lib/utils";

type Step = "contact" | "amount" | "confirm" | "sending" | "success" | "receipt";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];

function initialsColor(seed: number) {
  const tones = ["bg-kobo-teal-wash text-kobo-teal-dark", "bg-kobo-gold-soft text-kobo-gold-deep", "bg-kobo-mint text-kobo-mint-ink", "bg-kobo-coral-soft text-kobo-coral-deep"];
  return tones[seed % tones.length];
}

/** Fully simulated P2P send-money flow — contact → amount → confirm → success → receipt. */
export function SendFlow() {
  const available = useKoboStore((s) => s.availableBalance);
  const recordTransfer = useKoboStore((s) => s.recordTransfer);
  const receipt = useKoboStore((s) => s.receipt);

  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState<Contact | null>(null);
  const [query, setQuery] = useState("");

  const schema = useMemo(
    () =>
      z.object({
        amount: z
          .string()
          .min(1, "Enter an amount")
          .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Use numbers only, e.g. 2500")
          .refine((v) => Number(v) > 0, "Enter an amount greater than ₦0")
          .refine((v) => Number(v) <= available, "That's more than your demo balance"),
      }),
    [available],
  );

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: "" },
    mode: "onSubmit",
  });

  const amountRaw = watch("amount");
  const amount = Number(amountRaw || 0);

  const filtered = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const recent = mockContacts.filter((c) => c.recent);

  const press = (key: string) => {
    clearErrors("amount");
    const current = watch("amount") ?? "";
    if (key === "del") {
      setValue("amount", current.slice(0, -1), { shouldValidate: false });
      return;
    }
    if (key === "." && current.includes(".")) return;
    if (current.length >= 9) return;
    setValue("amount", current + key, { shouldValidate: false });
  };

  const onAmountValid = () => {
    if (!contact) return;
    setStep("confirm");
  };

  const onAmountInvalid: SubmitErrorHandler<FormValues> = (errs) => {
    if (errs.amount?.message) setError("amount", { message: errs.amount.message });
  };

  const confirm = () => {
    if (!contact) return;
    setStep("sending");
    window.setTimeout(() => {
      recordTransfer({
        recipientName: contact.name,
        recipientBank: contact.bank,
        recipientHandle: contact.handle,
        amount,
      });
      setStep("success");
    }, 1400);
  };

  const reset = () => {
    setStep("contact");
    setContact(null);
    setValue("amount", "");
    setQuery("");
  };

  const stepIndex = { contact: 1, amount: 2, confirm: 3, sending: 3, success: 4, receipt: 5 }[step];

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Progress */}
      <div className="mb-5 flex items-center gap-2" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-pill transition-colors duration-300 ${
              n <= stepIndex ? "bg-kobo-teal" : "bg-black/10"
            }`}
          />
        ))}
        <span className="ml-2 text-[0.7rem] font-bold text-kobo-muted">{stepIndex}/5</span>
      </div>

      <div className="kobo-card overflow-hidden p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          {/* ── Step 1: contact ─────────────────────────────── */}
          {step === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-title text-kobo-ink">Who are you sending to?</h2>
              <p className="mt-1 text-caption font-normal text-kobo-muted">
                Demo contacts only — no real accounts are involved.
              </p>

              <div className="relative mt-4">
                <Search
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kobo-muted"
                  aria-hidden
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search contacts"
                  aria-label="Search contacts"
                  className="pl-11"
                />
              </div>

              {!query && (
                <>
                  <p className="mb-2 mt-5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-kobo-muted">
                    Recent
                  </p>
                  <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                    {recent.map((c, i) => (
                      <motion.button
                        key={c.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          setContact(c);
                          setStep("amount");
                        }}
                        className="flex w-20 shrink-0 flex-col items-center gap-1.5"
                      >
                        <span
                          className={`grid h-14 w-14 place-items-center rounded-full text-lg font-bold ${initialsColor(i)}`}
                        >
                          {c.initials}
                        </span>
                        <span className="w-full truncate text-center text-caption font-semibold text-kobo-ink">
                          {c.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              <p className="mb-2 mt-5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-kobo-muted">
                All contacts
              </p>
              <ul className="space-y-2">
                {filtered.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      onClick={() => {
                        setContact(c);
                        setStep("amount");
                      }}
                      className="kobo-tap flex w-full items-center gap-3 rounded-2xl border-2 border-kobo-line bg-white px-4 text-left transition hover:border-kobo-teal"
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-bold ${initialsColor(i)}`}
                      >
                        {c.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.95rem] font-bold text-kobo-ink">
                          {c.name}
                        </span>
                        <span className="block text-caption font-normal text-kobo-muted">
                          {c.bank} {c.handle}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-kobo-muted" aria-hidden />
                    </button>
                  </motion.li>
                ))}
                {filtered.length === 0 && (
                  <li className="rounded-2xl bg-kobo-cream/70 px-4 py-8 text-center text-caption text-kobo-muted">
                    No contact matches “{query}”.
                  </li>
                )}
              </ul>
            </motion.div>
          )}

          {/* ── Step 2: amount (keypad + validation) ────────── */}
          {step === "amount" && contact && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setStep("contact")}
                className="mb-4 inline-flex items-center gap-1.5 text-caption font-bold text-kobo-muted hover:text-kobo-teal-dark"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Change recipient
              </button>

              <div className="flex items-center gap-3 rounded-2xl bg-kobo-cream/70 p-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-kobo-teal-wash font-bold text-kobo-teal-dark">
                  {contact.initials}
                </span>
                <span>
                  <span className="block text-[0.95rem] font-bold text-kobo-ink">{contact.name}</span>
                  <span className="block text-caption font-normal text-kobo-muted">
                    {contact.bank} {contact.handle}
                  </span>
                </span>
              </div>

              <form onSubmit={handleSubmit(onAmountValid, onAmountInvalid)}>
                <div className="mt-5 text-center">
                  <label htmlFor="amount" className="text-caption font-semibold text-kobo-muted">
                    Amount to send (demo)
                  </label>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-kobo-muted">₦</span>
                    <input
                      id="amount"
                      {...register("amount")}
                      readOnly
                      placeholder="0"
                      aria-invalid={!!errors.amount}
                      aria-describedby={errors.amount ? "amount-error" : undefined}
                      className="w-40 border-0 bg-transparent text-center text-display text-kobo-ink outline-none placeholder:text-kobo-muted/50"
                    />
                  </div>
                  {errors.amount ? (
                    <p
                      id="amount-error"
                      role="alert"
                      className="mt-1 text-caption font-bold text-kobo-rose-ink"
                    >
                      {errors.amount.message}
                    </p>
                  ) : (
                    <p className="mt-1 text-caption font-normal text-kobo-muted">
                      Balance: {naira(available)} (demo)
                    </p>
                  )}

                  <div className="mt-3 flex justify-center gap-2">
                    {[500, 1000, 2000].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          clearErrors("amount");
                          setValue("amount", String(v));
                        }}
                        className="h-9 rounded-pill bg-kobo-cream-deep px-3 text-caption font-bold text-kobo-charcoal transition hover:bg-kobo-teal hover:text-white"
                      >
                        {naira(v)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Friendly keypad with depth animation */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {keypad.map((key) => (
                    <motion.button
                      key={key}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => press(key)}
                      aria-label={key === "del" ? "Delete" : key}
                      className="kobo-tap grid place-items-center rounded-2xl border border-kobo-line bg-kobo-cream/60 text-xl font-bold text-kobo-ink transition hover:bg-kobo-cream-deep"
                    >
                      {key === "del" ? <Delete className="h-5 w-5" aria-hidden /> : key}
                    </motion.button>
                  ))}
                </div>

                <Button type="submit" size="lg" className="mt-4 w-full">
                  Review transfer
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </form>
            </motion.div>
          )}

          {/* ── Step 3: confirmation ────────────────────────── */}
          {step === "confirm" && contact && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-title text-kobo-ink">Confirm transfer</h2>
              <p className="mt-1 text-caption font-normal text-kobo-muted">
                Have a look before we simulate this — nothing actually moves.
              </p>

              <div className="mt-5 rounded-3xl bg-kobo-cream/70 p-5 text-center">
                <p className="text-caption font-semibold text-kobo-muted">You&apos;re sending</p>
                <p className="mt-1 text-display text-kobo-ink">{naira(amount, { decimals: "always" })}</p>
                <p className="mt-2 text-caption font-bold text-kobo-teal-dark">
                  to {contact.name} · {contact.bank} {contact.handle}
                </p>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-kobo-muted">Transfer fee</dt>
                  <dd className="font-bold text-kobo-mint-ink">₦0.00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-kobo-muted">New balance</dt>
                  <dd className="font-bold text-kobo-ink">
                    {naira(Math.max(0, available - amount))}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-kobo-muted">Type</dt>
                  <dd>
                    <Badge variant="coral">Simulated · demo only</Badge>
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-start gap-2 rounded-2xl bg-kobo-mint p-3.5 text-caption font-semibold text-kobo-mint-ink">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Kobo prototype never connects to a bank. This confirmation is purely for the demo.
              </div>

              <div className="mt-5 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep("amount")}>
                  Edit
                </Button>
                <Button className="flex-1" onClick={confirm}>
                  Confirm & send
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3b: sending… ───────────────────────────── */}
          {step === "sending" && contact && (
            <motion.div
              key="sending"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid place-items-center py-14 text-center"
            >
              <span className="grid h-20 w-20 place-items-center rounded-full bg-kobo-teal-wash">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  className="grid place-items-center"
                >
                  <Send className="h-8 w-8 text-kobo-teal-dark" aria-hidden />
                </motion.span>
              </span>
              <p className="mt-4 text-title text-kobo-ink">Simulating transfer…</p>
              <p className="mt-1 text-caption text-kobo-muted">No real money is moving.</p>
            </motion.div>
          )}

          {/* ── Step 4: success ─────────────────────────────── */}
          {step === "success" && contact && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="py-6 text-center"
            >
              <span className="relative mx-auto grid h-24 w-24 place-items-center">
                <span className="absolute inset-0 rounded-full bg-kobo-mint" aria-hidden />
                <svg viewBox="0 0 52 52" className="relative h-16 w-16" aria-hidden>
                  <motion.path
                    d="M14 27 L23 36 L38 18"
                    fill="none"
                    stroke="#0D9488"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                  />
                </svg>
              </span>

              <h2 className="mt-4 text-headline text-kobo-ink">Transfer sent</h2>
              <p className="mt-2 text-body text-kobo-muted">
                {naira(amount)} simulated to {contact.name}. Your demo balance has been updated.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Button size="lg" onClick={() => setStep("receipt")}>
                  <FileText className="h-4 w-4" aria-hidden />
                  View receipt
                </Button>
                <Button variant="outline" onClick={reset}>
                  Send another
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: receipt ─────────────────────────────── */}
          {step === "receipt" && receipt && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-title text-kobo-ink">Receipt</h2>
                <Badge variant="neutral">Demo</Badge>
              </div>

              <div className="mt-4 rounded-3xl border-2 border-dashed border-kobo-line bg-kobo-cream/60 p-5">
                <div className="grid place-items-center text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-kobo-teal text-white shadow-teal">
                    <Check className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="mt-3 text-caption font-semibold text-kobo-muted">Amount sent</p>
                  <p className="text-headline text-kobo-ink">
                    {naira(receipt.amount, { decimals: "always" })}
                  </p>
                </div>

                <dl className="mt-5 space-y-2.5 border-t border-dashed border-kobo-line pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-kobo-muted">Recipient</dt>
                    <dd className="text-right font-bold text-kobo-ink">{receipt.recipientName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-kobo-muted">Account</dt>
                    <dd className="text-right font-bold text-kobo-ink">
                      {receipt.recipientBank} {receipt.recipientHandle}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-kobo-muted">Reference</dt>
                    <dd className="text-right font-bold text-kobo-ink">{receipt.reference}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-kobo-muted">Date</dt>
                    <dd className="text-right font-bold text-kobo-ink">{receipt.time}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-kobo-muted">Status</dt>
                    <dd className="text-right">
                      <span className="rounded-pill bg-kobo-mint px-2.5 py-1 text-[0.72rem] font-bold text-kobo-mint-ink">
                        Simulated ✓
                      </span>
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-center text-[0.72rem] font-semibold text-kobo-coral-deep">
                  Prototype receipt — this is not a real transaction record.
                </p>
              </div>

              <Button size="lg" className="mt-5 w-full" onClick={reset}>
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
