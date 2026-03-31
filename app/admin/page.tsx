import Link from "next/link";
import {
  DollarSign,
  Users,
  Briefcase,
  Receipt,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sprout,
  ShoppingCart,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VolumeChart } from "@/components/admin/VolumeChart";
import {
  PLATFORM_STATS,
  INVOICES,
  FARMERS,
  GROCERY_STORES,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  submitted: { label: "Submitted", variant: "warning"  },
  confirmed: { label: "Confirmed", variant: "blue"     },
  funded:    { label: "Funded",    variant: "success"  },
  paid:      { label: "Paid",      variant: "outline"  },
  disputed:  { label: "Disputed",  variant: "danger"   },
};

export default function AdminDashboardPage() {
  const stats = PLATFORM_STATS;

  const activeInvoices = INVOICES.filter(
    (i) => i.status === "funded" || i.status === "confirmed"
  );
  const atRisk = activeInvoices.filter((i) => daysUntil(i.dueDate) <= 14);
  const recentInvoices = [...INVOICES]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  // Invoice status breakdown
  const statusCounts = INVOICES.reduce<Record<string, number>>((acc, inv) => {
    acc[inv.status] = (acc[inv.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-0">
            Platform Overview
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        {atRisk.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              {atRisk.length} deal{atRisk.length !== 1 ? "s" : ""} maturing within 14 days
            </span>
          </div>
        )}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Volume"
          value={formatCurrency(stats.totalInvoiceVolume)}
          sub="all-time invoiced"
          icon={DollarSign}
          iconColor="text-violet-500"
          trend={{ value: "+12% vs last month", positive: true }}
        />
        <StatCard
          label="Capital Deployed"
          value={formatCurrency(stats.capitalDeployed)}
          sub="currently invested"
          icon={Briefcase}
          iconColor="text-brand-600"
        />
        <StatCard
          label="Fees Collected"
          value={formatCurrency(stats.totalFeesCollected)}
          sub="all-time platform revenue"
          icon={Receipt}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Active Deals"
          value={String(stats.activeDeals)}
          sub={`${stats.avgYieldRate}% avg APY`}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Investors"
          value={String(stats.totalInvestors)}
          sub="registered"
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatCard
          label="Farmers"
          value={String(stats.totalFarmers)}
          sub="active accounts"
          icon={Sprout}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Stores"
          value={String(GROCERY_STORES.length)}
          sub="partner buyers"
          icon={ShoppingCart}
          iconColor="text-sky-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Volume chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Monthly Invoice Volume</CardTitle>
                <Badge variant="default">6-month view</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <VolumeChart />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Submitted",  count: statusCounts["submitted"] ?? 0 },
                  { label: "Funded",     count: statusCounts["funded"]    ?? 0 },
                  { label: "Paid",       count: statusCounts["paid"]      ?? 0 },
                ].map(({ label, count }) => (
                  <div key={label} className="rounded-lg bg-surface-800 py-2">
                    <p className="text-xl font-bold text-surface-0">{count}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* At-risk & quick links */}
        <div className="space-y-4">
          {/* At-risk deals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Maturing Soon</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/deals" className="flex items-center gap-1 text-xs">
                    All deals <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {atRisk.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  No urgent maturities
                </div>
              ) : (
                atRisk.slice(0, 4).map((inv) => {
                  const days = daysUntil(inv.dueDate);
                  return (
                    <div key={inv.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-surface-0 truncate">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-xs text-surface-400 truncate">{inv.storeName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-semibold ${days <= 7 ? "text-red-600" : "text-amber-600"}`}>
                          {days}d
                        </p>
                        <p className="text-xs text-surface-400">{formatCurrency(inv.amount)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Quick navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/admin/invoices", label: "Manage Invoices",  icon: Receipt,   count: INVOICES.length },
                { href: "/admin/users",    label: "Manage Users",     icon: Users,     count: stats.totalInvestors + stats.totalFarmers + GROCERY_STORES.length },
                { href: "/admin/deals",    label: "Monitor Deals",    icon: Briefcase, count: stats.activeDeals },
                { href: "/admin/fees",     label: "Fee Ledger",       icon: DollarSign, count: null },
              ].map(({ href, label, icon: Icon, count }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-surface-600 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-surface-400" />
                    <span className="text-sm font-medium text-surface-200">{label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {count !== null && (
                      <span className="text-xs text-surface-400">{count}</span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-surface-300" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent invoice activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoice Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/invoices" className="flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Invoice</th>
                <th className="px-6 py-3 text-left font-medium">Supplier</th>
                <th className="px-6 py-3 text-left font-medium">Buyer</th>
                <th className="px-6 py-3 text-left font-medium">Amount</th>
                <th className="px-6 py-3 text-left font-medium">Due</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Funded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {recentInvoices.map((inv) => {
                const badge = STATUS_BADGE[inv.status] ?? { label: inv.status, variant: "secondary" as const };
                return (
                  <tr key={inv.id} className="hover:bg-surface-800 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-surface-0">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-3.5 text-surface-600 max-w-[140px] truncate">
                      {inv.farmerName}
                    </td>
                    <td className="px-6 py-3.5 text-surface-600 max-w-[140px] truncate">
                      {inv.storeName}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-surface-0">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-6 py-3.5 text-surface-500">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-600 overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${inv.fundedPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-surface-400">
                          {inv.fundedPercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Farmer & store health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Suppliers</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {FARMERS.map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Sprout className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-0 truncate">{f.name}</p>
                  <p className="text-xs text-surface-400">{f.location} · {f.invoiceCount} invoices</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-surface-0">{formatCurrency(f.totalFunded)}</p>
                  <p className="text-xs text-surface-400">funded</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partner Stores</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {GROCERY_STORES.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-0 truncate">{s.name}</p>
                  <p className="text-xs text-surface-400">{s.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-surface-0">{formatCurrency(s.totalOwed)}</p>
                  {s.pendingConfirmations > 0 && (
                    <Badge variant="warning" className="text-[10px] mt-0.5">
                      {s.pendingConfirmations} pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
