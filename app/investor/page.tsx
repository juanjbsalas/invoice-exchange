import Link from "next/link";
import { ArrowRight, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EarningsChart } from "@/components/investor/EarningsChart";
import { DEMO_INVESTOR, INVESTMENTS, INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

export default function InvestorHomePage() {
  const investor = DEMO_INVESTOR;
  const active = INVESTMENTS.filter((i) => i.status === "active");
  const matured = INVESTMENTS.filter((i) => i.status === "matured");

  // Available deals (confirmed/funded but not 100%)
  const available = INVOICES.filter(
    (i) =>
      (i.status === "confirmed" || i.status === "funded") &&
      i.fundedPercent < 100
  ).slice(0, 3);

  const projectedTotal = active.reduce((s, i) => s + i.projectedReturn, 0);
  const projectedEarnings = projectedTotal - active.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Balance hero — Robinhood style */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 p-7 text-white">
        <p className="text-sm font-medium text-white/70 mb-1">Total Balance</p>
        <p className="text-5xl font-bold tracking-tight">
          {formatCurrency(investor.balance)}
        </p>

        <div className="mt-5 flex items-center gap-6">
          <div>
            <p className="text-xs text-white/60">Currently Invested</p>
            <p className="text-lg font-semibold mt-0.5">
              {formatCurrency(investor.totalInvested)}
            </p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-xs text-white/60">Total Earned</p>
            <p className="text-lg font-semibold text-green-300 mt-0.5">
              +{formatCurrency(investor.totalEarned)}
            </p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-xs text-white/60">Current APY</p>
            <p className="text-lg font-semibold text-green-300 mt-0.5">8.0%</p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            variant="accent"
            size="sm"
            asChild
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Link href="/investor/deals">
              <Zap className="h-3.5 w-3.5" />
              Browse Deals
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Link href="/investor/withdraw">Withdraw</Link>
          </Button>
        </div>
      </div>

      {/* Earnings chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Earnings Over Time</CardTitle>
            <Badge variant="success">+{formatCurrency(investor.totalEarned)} total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <EarningsChart />
          <p className="text-xs text-surface-400 mt-3 text-center">
            Projected earnings to maturity:{" "}
            <span className="text-green-600 font-semibold">
              +{formatCurrency(projectedEarnings)}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Active investments */}
      {active.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Investments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/investor/portfolio" className="flex items-center gap-1">
                  Portfolio <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {active.map((inv) => {
              const days = daysUntil(inv.maturityDate);
              const earning = inv.projectedReturn - inv.amount;
              return (
                <div
                  key={inv.id}
                  className="flex items-center gap-4 rounded-xl border border-surface-200 p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-surface-900">
                        {inv.invoiceNumber}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {inv.yieldRate}% APY
                      </Badge>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {inv.storeName} · Matures {formatDate(inv.maturityDate)}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-surface-400 mb-1">
                        <span>Time to maturity</span>
                        <span>{days}d left</span>
                      </div>
                      <Progress
                        value={Math.max(0, 100 - Math.round((days / 60) * 100))}
                        className="h-1.5"
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-surface-900">
                      {formatCurrency(inv.amount)}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      +{formatCurrency(earning)} projected
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Available deals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Deals</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/investor/deals" className="flex items-center gap-1">
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {available.map((deal) => {
            const remaining = deal.amount * (1 - deal.fundedPercent / 100);
            return (
              <Link
                key={deal.id}
                href={`/investor/deals/${deal.id}`}
                className="block rounded-xl border border-surface-200 p-4 hover:border-violet-300 hover:bg-violet-50/50 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900">
                      {deal.storeName}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5 truncate">
                      {deal.goods}
                    </p>
                    <div className="mt-2.5 space-y-1">
                      <div className="flex justify-between text-xs text-surface-500">
                        <span>{deal.fundedPercent}% filled</span>
                        <span>{formatCurrency(remaining)} left</span>
                      </div>
                      <Progress value={deal.fundedPercent} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-surface-400">Matures</p>
                    <p className="text-sm font-medium text-surface-700">
                      {formatDate(deal.dueDate)}
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      {deal.yieldRate}%
                    </p>
                    <p className="text-[10px] text-surface-400">APY</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, label: "Asset-backed", sub: "Real invoice collateral" },
          { icon: TrendingUp,  label: "8% APY",       sub: "Flat, predictable yield" },
          { icon: Zap,         label: "Short terms",  sub: "30–90 day maturities"   },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center rounded-xl border border-surface-200 bg-surface-0 p-4"
          >
            <Icon className="h-5 w-5 text-violet-500 mb-2" />
            <p className="text-sm font-semibold text-surface-900">{label}</p>
            <p className="text-xs text-surface-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
