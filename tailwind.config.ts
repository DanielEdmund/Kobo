import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Kobo design system — utility-first tokens with a professional, restrained
 * palette: neutral slate canvas, deep teal brand, amber/gold reserved for
 * reward states, rose reserved for alerts.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kobo: {
          teal: {
            DEFAULT: "#0D9488",
            deep: "#0F766E",
            dark: "#115E59",
            soft: "#99F6E4",
            wash: "#F0FDFA",
          },
          coral: {
            DEFAULT: "#EA580C",
            deep: "#C2410C",
            soft: "#FFEDD5",
          },
          gold: {
            DEFAULT: "#F59E0B",
            deep: "#B45309",
            soft: "#FEF3C7",
          },
          cream: {
            DEFAULT: "#F8FAFC",
            deep: "#F1F5F9",
          },
          charcoal: "#334155",
          ink: "#0F172A",
          muted: "#64748B",
          line: "#E2E8F0",
          mint: {
            DEFAULT: "#D1FAE5",
            deep: "#A7F3D0",
            ink: "#047857",
          },
          rose: {
            DEFAULT: "#FDA4AF",
            deep: "#E11D48",
            ink: "#BE123C",
            soft: "#FFE4E6",
          },
          slate: {
            wash: "#F1F5F9",
            deep: "#E2E8F0",
          },
        },
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // Readable financial typography — big, calm numbers
        display: ["2.5rem", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "700" }],
        headline: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        title: ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.45", fontWeight: "500" }],
        amount: ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      spacing: {
        // KoboSpacing tokens (Tailwind scale + generous breathing room)
        "18": "4.5rem",
        "112": "28rem",
        "safe": "env(safe-area-inset-bottom)",
      },
      borderRadius: {
        card: "0.875rem",
        blob: "1.25rem",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.04)",
        lift: "0 4px 12px -6px rgba(15,23,42,0.10), 0 14px 28px -18px rgba(15,23,42,0.16)",
        teal: "0 1px 2px rgba(15,118,110,0.18)",
        gold: "0 1px 2px rgba(180,83,9,0.16)",
        coral: "0 1px 2px rgba(194,65,12,0.16)",
        innerSoft: "inset 0 1px 2px rgba(15,23,42,0.05)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "30%": { transform: "translateX(-3px)" },
          "60%": { transform: "translateX(3px)" },
          "80%": { transform: "translateX(-1px)" },
        },
        "grow-bar": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
        "grow-bar": "grow-bar 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      transitionDuration: {
        page: "200ms",
      },
    },
  },
  plugins: [animate],
};

export default config;
