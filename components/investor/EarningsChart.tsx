"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { INVESTOR_GROWTH_DATA } from "@/lib/mock-data";

interface TooltipPayload {
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="text-surface-500 mb-0.5">{label}</p>
      <p className="font-semibold text-surface-900">
        ${payload[0].value.toFixed(2)} earned
      </p>
    </div>
  );
}

export function EarningsChart() {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart
        data={INVESTOR_GROWTH_DATA}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="earnings"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#earningsGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#10b981" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
