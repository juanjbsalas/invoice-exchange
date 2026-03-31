import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor = "text-[#00C805]",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#00C805]/20 bg-surface-800 p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-surface-400 font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-surface-0 tracking-tight">
            {value}
          </p>
          {sub && <p className="mt-0.5 text-xs text-surface-400">{sub}</p>}
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.positive ? "text-[#00C805]" : "text-red-400"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-surface-700 p-2.5">
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
