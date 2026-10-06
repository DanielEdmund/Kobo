import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Kobo — Every kobo counts",
  description:
    "Kobo is a friendly personal-finance prototype that helps everyday Nigerians understand, budget, save and grow their money. Frontend demo with mock data only — no real transactions.",
  keywords: ["personal finance", "Nigeria", "savings", "budgeting", "prototype", "demo"],
};

export const viewport: Viewport = {
  themeColor: "#115E59",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-kobo-teal focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
