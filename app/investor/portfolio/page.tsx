import Link from "next/link";
import { TrendingUp, Clock, CheckCircle2, DollarSign, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INVESTMENTS, DEMO_INVESTOR } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const meta = user.user_metadata ?? {};
  const userName =
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "User";

  const active  = INVESTMENTS.filter((i) => i.status === "active");
  const matured = INVESTMENTS.filter((i) => i.status === "matured");

  const totalActive    = active.reduce((s, i) => s + i.amount, 0);
  const projectedTotal = active.reduce((s, i) => s + i.projectedReturn, 0);
  const projectedGain  = projectedTotal - totalActive;
  const actualEarned   = matured.reduce((s, i) => s + (i.actualReturn ?? 0) - i.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-0">Portfolio</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {userName} · {active.length} active, {matured.length} matured
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active"
          value={formatCurrency(totalActive)}
          sub={`${active.length} investment${active.length !== 1 ? "s" : ""}`}
          icon={Clock}
          iconColor="text-violet-500"
        />
        <StatCard
          label="Projected Gain"
          value={`+${formatCurrency(projectedGain)}`}
          sub="from active deals"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          label="Total Earned"
          value={`+${formatCurrency(actualEarned)}`}
          sub="from matured deals"
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <StatCard
          label="Balance"
          value={formatCurrency(DEMO_INVESTOR.balance)}
          sub="available to invest"
          icon={DollarSign}
          iconColor="text-brand-600"
        />
      </div>

      {/* Active investments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Investments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/investor/deals" className="flex items-center gap-1">
                Find deals <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        {active.length === 0 ? (
          <CardContent>
            <div className="py-10 text-center">
              <p className="text-surface-400 font-medium">No active investments</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/investor/deals">Browse Deals</Link>
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Deal</th>
                  <th className="px-6 py-3 text-left font-medium">Invested</th>
                  <th className="px-6 py-3 text-left font-medium">Return</th>
                  <th className="px-6 py-3 text-left font-medium">APY</th>
                  <th className="px-6 py-3 text-left font-medium">Maturity</th>
                  <th className="px-6 py-3 text-left font-medium">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {active.map((inv) => {
                  const days    = daysUntil(inv.maturityDate);
                  const earning = inv.projectedReturn - inv.amount;
                  // approximate 60-day term for progress
                  const pct = Math.max(0, Math.min(100, Math.round((1 - days / 60) * 100)));
                  return (
                    <tr key={inv.id} className="hover:bg-surface-800 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-surface-0">{inv.invoiceNumber}</p>
                        <p className="text-xs text-surface-400">{inv.storeName}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-surface-0">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-surface-0">{formatCurrency(inv.projectedReturn)}</p>
                        <p className="text-xs text-green-600 font-medium">+{formatCurrency(earning)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">{inv.yieldRate}%</Badge>
                      </td>
                      <td className="px-6 py-4 text-surface-600">
                        <p>{formatDate(inv.maturityDate)}</p>
                        <p className="text-xs text-surface-400">{days}d left</p>
                      </td>
                      <td className="px-6 py-4 w-32">
                        <Progress value={pct} className="h-1.5" />
                        <p className="text-xs text-surface-400 mt-1">{pct}% through term</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        )}
      </Card>

      {/* Matured investments */}
      {matured.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matured Investments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Deal</th>
                  <th className="px-6 py-3 text-left font-medium">Invested</th>
                  <th className="px-6 py-3 text-left font-medium">Returned</th>
                  <th className="px-6 py-3 text-left font-medium">Earned</th>
                  <th className="px-6 py-3 text-left font-medium">Matured On</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {matured.map((inv) => {
                  const earned = (inv.actualReturn ?? 0) - inv.amount;
                  return (
                    <tr key={inv.id} className="hover:bg-surface-800 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-surface-0">{inv.invoiceNumber}</p>
                        <p className="text-xs text-surface-400">{inv.storeName}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-surface-0">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-surface-0">
                        {formatCurrency(inv.actualReturn ?? 0)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        +{formatCurrency(earned)}
                      </td>
                      <td className="px-6 py-4 text-surface-500">
                        {formatDate(inv.maturityDate)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">Paid out</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
