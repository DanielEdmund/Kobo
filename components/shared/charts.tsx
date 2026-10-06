"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { mockCategorySplit, mockSavingsGrowth, mockWeeklySpend } from "@/data/mock-data";
import { naira, nairaCompact } from "@/lib/utils";

/** Local mock charts — no real-time financial data anywhere. */

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(15,23,42,0.10)",
  borderRadius: 10,
  boxShadow: "0 4px 12px -6px rgba(15,23,42,0.16)",
  fontSize: 13,
  color: "#334155",
  fontWeight: 600,
};

export function WeeklySpendChart({ height = 200 }: { height?: number }) {
  return (
    <div role="img" aria-label="Mock chart of spending across this week" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mockWeeklySpend} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.08)" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickFormatter={nairaCompact}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "rgba(13,148,136,0.08)", radius: 12 }}
            formatter={(value) => [naira(Number(value)), "Spent"]}
            labelFormatter={(label) => `${label} (demo data)`}
          />
          <Bar dataKey="amount" fill="#0D9488" radius={[8, 8, 8, 8]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SavingsGrowthChart({ height = 220 }: { height?: number }) {
  return (
    <div role="img" aria-label="Mock chart of savings growth over six months" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockSavingsGrowth} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D9488" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0D9488" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.08)" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748B" }}
            tickFormatter={nairaCompact}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [naira(Number(value)), "Savings"]}
            labelFormatter={(label) => `${label} (demo data)`}
          />
          <Area
            type="monotone"
            dataKey="savings"
            stroke="#0D9488"
            strokeWidth={3}
            fill="url(#savingsFill)"
            dot={{ r: 4, fill: "#0D9488", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#0D9488", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonutChart({ height = 220 }: { height?: number }) {
  const total = mockCategorySplit.reduce((sum, item) => sum + item.value, 0);

  return (
    <div role="img" aria-label="Mock chart of spending split by category" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={mockCategorySplit}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={3}
            stroke="none"
          >
            {mockCategorySplit.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              `${naira(Number(value))} · ${Math.round((Number(value) / total) * 100)}%`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
