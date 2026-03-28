import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

export default function AdminDealsPage() {
  const funded   = INVOICES.filter((i) => i.status === "funded");
  const confirmed = INVOICES.filter((i) => i.status === "confirmed");
  const active   = [...funded, ...confirmed];

  const atRisk   = active.filter((i) => daysUntil(i.dueDate) <= 14);
  const healthy  = active.filter((i) => daysUntil(i.dueDate) > 14);

  const capitalDeployed = funded.reduce((s, i) => s + i.amount * (i.fundedPercent / 100), 0);
  const totalFunding    = active.reduce((s, i) => s + i.amount, 0);
  const avgFunded       = active.length
    ? Math.round(active.reduce((s, i) => s + i.fundedPercent, 0) / active.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Deal Monitor</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {active.length} active deals · {atRisk.length} maturing within 14 days
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Deals"
          value={String(active.length)}
          sub={`${funded.length} funded, ${confirmed.length} confirmed`}
          icon={Briefcase}
          iconColor="text-violet-500"
        />
        <StatCard
          label="Capital Deployed"
          value={formatCurrency(capitalDeployed)}
          sub="from investors"
          icon={DollarSign}
          iconColor="text-brand-600"
        />
        <StatCard
          label="Avg Funded"
          value={`${avgFunded}%`}
          sub="across active deals"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          label="At Risk"
          value={String(atRisk.length)}
          sub="maturing ≤ 14 days"
          icon={AlertTriangle}
          iconColor={atRisk.length > 0 ? "text-amber-500" : "text-green-500"}
        />
      </div>

      {/* At-risk deals */}
      {atRisk.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-amber-800">Maturing Within 14 Days</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DealTable deals={atRisk} urgent />
          </CardContent>
        </Card>
      )}

      {/* Healthy deals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <CardTitle>Active Deals</CardTitle>
          </div>
        </CardHeader>
        {healthy.length === 0 ? (
          <CardContent>
            <p className="text-sm text-surface-400 text-center py-8">No active deals beyond 14 days.</p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <DealTable deals={healthy} />
          </CardContent>
        )}
      </Card>

      {/* Paid deals */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Completed</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DealTable deals={INVOICES.filter((i) => i.status === "paid")} completed />
        </CardContent>
      </Card>
    </div>
  );
}

// Need to import Briefcase separately for the stat card icon
import { Briefcase } from "lucide-react";
import type { Invoice } from "@/lib/types";

function DealTable({
  deals,
  urgent,
  completed,
}: {
  deals: Invoice[];
  urgent?: boolean;
  completed?: boolean;
}) {
  if (deals.length === 0) return (
    <div className="py-8 text-center text-sm text-surface-400">No deals.</div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
            <th className="px-5 py-3 text-left font-medium">Invoice</th>
            <th className="px-5 py-3 text-left font-medium">Supplier → Buyer</th>
            <th className="px-5 py-3 text-left font-medium">Amount</th>
            <th className="px-5 py-3 text-left font-medium">Due / Paid</th>
            <th className="px-5 py-3 text-left font-medium">Days Left</th>
            <th className="px-5 py-3 text-left font-medium">Funded</th>
            <th className="px-5 py-3 text-left font-medium">Investors</th>
            <th className="px-5 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {deals.map((inv) => {
            const days = completed ? null : daysUntil(inv.dueDate);
            const isRed = days !== null && days <= 7;

            return (
              <tr key={inv.id} className={`hover:bg-surface-50 transition-colors ${urgent ? "bg-amber-50/40" : ""}`}>
                <td className="px-5 py-3.5 font-medium text-surface-900">
                  {inv.invoiceNumber}
                </td>
                <td className="px-5 py-3.5 text-surface-600 text-xs">
                  <span className="text-emerald-700">{inv.farmerName}</span>
                  <span className="text-surface-400 mx-1">→</span>
                  <span className="text-blue-700">{inv.storeName}</span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-surface-900">
                  {formatCurrency(inv.amount)}
                </td>
                <td className="px-5 py-3.5 text-surface-500">
                  {completed ? formatDate(inv.paidDate ?? inv.dueDate) : formatDate(inv.dueDate)}
                </td>
                <td className="px-5 py-3.5">
                  {completed ? (
                    <Badge variant="outline">Paid</Badge>
                  ) : (
                    <span className={`font-semibold text-sm ${isRed ? "text-red-600" : days! <= 14 ? "text-amber-600" : "text-surface-700"}`}>
                      {days}d
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 w-32">
                  <div className="space-y-1">
                    <Progress value={inv.fundedPercent} className="h-1.5" />
                    <p className="text-xs text-surface-400">{inv.fundedPercent}%</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-surface-600">
                    <Users className="h-3.5 w-3.5 text-surface-400" />
                    {inv.totalInvestors}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {completed ? (
                    <Badge variant="success">Completed</Badge>
                  ) : inv.status === "funded" ? (
                    <Badge variant="success">Funded</Badge>
                  ) : (
                    <Badge variant="blue">Confirmed</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
