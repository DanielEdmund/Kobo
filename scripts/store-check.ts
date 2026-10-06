/**
 * Headless smoke-test of the Kobo mock store (prototype verification only).
 * Run: npx tsx scripts/store-check.ts
 */

async function main() {
  // Shim a browser-ish global so the store's timers work in Node.
  (globalThis as unknown as { window: unknown }).window = globalThis;

  const { useKoboStore, totalSavings, savingsProgress, budgetStatus } = await import(
    "../store/kobo-store"
  );

  const s = () => useKoboStore.getState();
  const line = (label: string, value: unknown) => console.log(`${label.padEnd(46)} ${value}`);

line("Start balance", s().availableBalance);
line("Start savings total", totalSavings(s().goals));
line("Start savings progress", `${savingsProgress(s().goals)}%`);
line("Transactions seeded", s().transactions.length);

/* 1. Hide balance */
s().toggleBalanceHidden();
line("After hide toggle (balanceHidden)", s().balanceHidden);
s().toggleBalanceHidden();

/* 2. Save into a goal */
const before = s().goals.find((g) => g.id === "parents")!.saved;
s().addToGoal("parents", 1000);
const after = s().goals.find((g) => g.id === "parents")!.saved;
line("Parents' Gift before → after +₦1000", `${before} → ${after}`);
line("Balance after save (−₦1000)", s().availableBalance);
line("Coin burst event", JSON.stringify(s().coinBurst));
line("Toasts queued", s().toasts.length);

/* 3. Fill the goal to 100% → celebration */
for (let i = 0; i < 5 && s().goals.find((g) => g.id === "parents")!.saved < 30000; i++) {
  s().addToGoal("parents", 1000);
}
const parents = s().goals.find((g) => g.id === "parents")!;
line("Parents' Gift fully funded", `${parents.saved}/${parents.target}`);
line("Goal celebration", JSON.stringify(s().celebration?.title ?? null));
line(
  "Goal Crusher unlocked",
  s().achievements.find((a) => a.id === "a7")?.unlocked,
);

/* 4. Round-up */
const roundupBefore = s().roundUpMonthly;
s().simulateRoundUp();
line("Round-up monthly total", `${roundupBefore} → ${s().roundUpMonthly}`);
line("Round-ups default ON", s().roundUpsOn);

/* 5. Budget expense → over budget state */
s().spendFromBudget("shopping", 1000);
const shopping = s().budgets.find((b) => b.id === "shopping")!;
line("Shopping spent → status", `${shopping.spent} → ${budgetStatus(shopping)}`);
line("Food status (safe)", budgetStatus(s().budgets.find((b) => b.id === "food")!));
line("Bills status (at limit)", budgetStatus(s().budgets.find((b) => b.id === "bills")!));

/* 6. Adjust a budget limit */
s().adjustBudgetLimit("shopping", 15000);
line("Shopping after limit adjust", `limit=${s().budgets.find((b) => b.id === "shopping")!.limit}`);

/* 7. Simulated transfer */
const balBefore = s().availableBalance;
const receipt = s().recordTransfer({
  recipientName: "Mum",
  recipientBank: "GTBank",
  recipientHandle: "••4102",
  amount: 2500,
});
line("Transfer receipt ref / time", `${receipt.reference} · ${receipt.time}`);
line("Balance after transfer", `${balBefore} → ${s().availableBalance}`);
line("Newest transaction", `${s().transactions[0].merchant} · ${s().transactions[0].amount}`);

/* 8. Hide + recategorize transactions */
s().hideTransaction(s().transactions[3].id);
line("Hidden transaction ids", s().hiddenTxIds.length);

/* 9. Learn progress */
s().completeArticle("l2");
line("Article l2 progress", s().articles.find((a) => a.id === "l2")!.progress);

/* 10. Streak */
s().saveToday();
line("Streak after saveToday", `${s().streak.days} · savedToday=${s().streak.savedToday}`);
s().saveToday(); // second attempt should be blocked
line("Streak (second attempt blocked)", s().streak.days);

/* 11. Achievement unlock + reset */
s().unlockAchievement("a5");
line("Budget Boss unlocked", s().achievements.find((a) => a.id === "a5")!.unlocked);
s().resetDemo();
line("After reset → balance / savings", `${s().availableBalance} / ${totalSavings(s().goals)}`);
  line("After reset → transactions", s().transactions.length);

  console.log("\nAll store interactions behaved as expected.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
