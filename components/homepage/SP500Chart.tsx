"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import type { YearlyReturn } from "@/app/api/sp500/route";

const S_AND_P_COLOR = "#4A90E2";
const IX_COLOR = "#00C805";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-surface-0 mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="leading-snug">
          {entry.name}:{" "}
          <span className="font-bold">
            {entry.value > 0 ? "+" : ""}
            {entry.value.toFixed(2)}%
          </span>
        </p>
      ))}
    </div>
  );
}

export function SP500Chart() {
  const [data, setData] = useState<YearlyReturn[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sp500");
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error ?? "Failed to load data");
      }
      setData(json);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="w-full h-[340px] rounded-xl bg-surface-700 animate-pulse" />
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-[340px] rounded-xl bg-surface-700 border border-surface-600 flex flex-col items-center justify-center gap-3">
        <p className="text-surface-400 text-sm">Could not load S&P 500 data.</p>
        <button
          onClick={fetchData}
          className="text-xs text-ix-blue-400 hover:text-ix-blue-300 underline transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-surface-700 border border-surface-600 p-6">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#8E9AA0", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`}
            tick={{ fill: "#8E9AA0", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "16px", fontSize: "13px", color: "#8E9AA0" }}
          />
          <Line
            type="monotone"
            dataKey="spReturn"
            name="S&P 500"
            stroke={S_AND_P_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: S_AND_P_COLOR }}
          />
          <Line
            type="monotone"
            dataKey="ixReturn"
            name="invoiceXchange (8% APY)"
            stroke={IX_COLOR}
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 4, fill: IX_COLOR }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
