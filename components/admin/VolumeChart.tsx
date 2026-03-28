"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MONTHLY_VOLUME } from "@/lib/mock-data";

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
        ${(payload[0].value / 1000).toFixed(1)}k volume
      </p>
    </div>
  );
}

export function VolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={MONTHLY_VOLUME}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
        barSize={24}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v / 1000}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="volume" fill="#6d28d9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
