import Link from "next/link";
import {
  ClipboardCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { INVOICES, GROCERY_STORES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

const STORE_ID = "s1";

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  submitted: { label: "Needs Confirmation", variant: "warning"  },
  confirmed: { label: "Confirmed",          variant: "blue"     },
  funded:    { label: "Funded",             variant: "success"  },
  paid:      { label: "Paid",               variant: "outline"  },
  disputed:  { label: "Disputed",           variant: "danger"   },
};

export default function StoreDashboardPage() {
  const store = GROCERY_STORES.find((s) => s.id === STORE_ID)!;
  const myInvoices = INVOICES.filter((i) => i.storeId === STORE_ID);

  const needsConfirmation = myInvoices.filter((i) => i.status === "submitted");
  const upcoming = myInvoices
    .filter((i) => (i.status === "funded" || i.status === "confirmed") && daysUntil(i.dueDate) > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const totalOwed = upcoming.reduce((s, i) => s + i.amount, 0);
  const paidCount = myInvoices.filter((i) => i.status === "paid").length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-0">
          Welcome back, Jordan
        </h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {store.name} · {store.location}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Needs Confirmation"
          value={String(needsConfirmation.length)}
          sub={needsConfirmation.length > 0 ? "action required" : "all clear"}
          icon={AlertCircle}
          iconColor={needsConfirmation.length > 0 ? "text-amber-500" : "text-green-500"}
        />
        <StatCard
          label="Upcoming Payments"
          value={String(upcoming.length)}
          sub="active obligations"
          icon={Calendar}
          iconColor="text-blue-500"
        />
        <StatCard
          label="Total Owed"
          value={formatCurrency(totalOwed)}
          sub="across active invoices"
          icon={DollarSign}
          iconColor="text-brand-600"
        />
        <StatCard
          label="Invoices Paid"
          value={String(paidCount)}
          sub="lifetime"
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
      </div>

      {/* Confirmation queue alert */}
      {needsConfirmation.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {needsConfirmation.length} invoice
                {needsConfirmation.length !== 1 ? "s" : ""} awaiting your
                confirmation
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Confirming invoices allows suppliers to receive funds faster.
              </p>
            </div>
          </div>
          <Button variant="accent" size="sm" asChild>
            <Link href="/manufacturer/invoices">Review Now</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pending confirmations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoice Queue</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/manufacturer/invoices" className="flex items-center gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsConfirmation.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-400 mb-2" />
                <p className="text-sm text-surface-500 font-medium">
                  No pending confirmations
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  You&apos;re all caught up.
                </p>
              </div>
            ) : (
              needsConfirmation.slice(0, 3).map((inv) => (
                <InvoiceQueueItem key={inv.id} inv={inv} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Payments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/manufacturer/schedule" className="flex items-center gap-1">
                  Schedule <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-surface-400 text-center py-8">
                No upcoming payments.
              </p>
            ) : (
              upcoming.slice(0, 4).map((inv) => {
                const days = daysUntil(inv.dueDate);
                const urgent = days <= 14;
                return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          urgent ? "bg-amber-400" : "bg-blue-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-0 truncate">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-xs text-surface-400 truncate">
                          {inv.farmerName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-semibold text-surface-0">
                        {formatCurrency(inv.amount)}
                      </p>
                      <p
                        className={`text-xs ${
                          urgent ? "text-amber-600 font-medium" : "text-surface-400"
                        }`}
                      >
                        {days}d · {formatDate(inv.dueDate)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* All invoices table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Invoice</th>
                <th className="px-6 py-3 text-left font-medium">Supplier</th>
                <th className="px-6 py-3 text-left font-medium">Amount</th>
                <th className="px-6 py-3 text-left font-medium">Due Date</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {myInvoices.map((inv) => {
                const badge = STATUS_BADGE[inv.status] ?? { label: inv.status, variant: "secondary" as const };
                return (
                  <tr key={inv.id} className="hover:bg-surface-800 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-surface-0">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-3.5 text-surface-600">
                      {inv.farmerName}
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
                    <td className="px-6 py-3.5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/manufacturer/invoices/${inv.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceQueueItem({ inv }: { inv: Invoice }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-surface-0">
          {inv.invoiceNumber}
        </p>
        <p className="text-xs text-surface-500 truncate">
          {inv.farmerName} · {formatCurrency(inv.amount)}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Clock className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs text-amber-600 font-medium">
          {daysUntil(inv.dueDate)}d left
        </span>
      </div>
    </div>
  );
}
