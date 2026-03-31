import Link from "next/link";
import {
  DollarSign,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

const STORE_ID = "s1";

// Group invoices by month label
function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function PaymentSchedulePage() {
  const mine = INVOICES.filter((i) => i.storeId === STORE_ID);

  const upcoming = mine
    .filter((i) => i.status !== "paid" && i.status !== "draft")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const paid = mine
    .filter((i) => i.status === "paid")
    .sort((a, b) => new Date(b.paidDate ?? b.dueDate).getTime() - new Date(a.paidDate ?? a.dueDate).getTime());

  const totalUpcoming = upcoming.reduce((s, i) => s + i.amount, 0);
  const totalPaid     = paid.reduce((s, i) => s + i.amount, 0);

  // Group upcoming by month
  const byMonth = upcoming.reduce<Record<string, typeof upcoming>>(
    (acc, inv) => {
      const key = monthLabel(inv.dueDate);
      if (!acc[key]) acc[key] = [];
      acc[key].push(inv);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-0">Payment Schedule</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Your upcoming obligations and payment history
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-surface-600 bg-surface-700 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-surface-500 font-medium">Due This Month</p>
              <p className="mt-1 text-2xl font-bold text-surface-0 tracking-tight">
                {formatCurrency(
                  upcoming
                    .filter((i) => {
                      const d = new Date(i.dueDate);
                      const now = new Date();
                      return (
                        d.getMonth() === now.getMonth() &&
                        d.getFullYear() === now.getFullYear()
                      );
                    })
                    .reduce((s, i) => s + i.amount, 0)
                )}
              </p>
              <button className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors">
                Pay
              </button>
            </div>
            <div className="rounded-lg bg-surface-600 p-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </div>
        <StatCard
          label="Total Upcoming"
          value={formatCurrency(totalUpcoming)}
          sub={`${upcoming.length} invoices`}
          icon={CalendarClock}
          iconColor="text-blue-500"
        />
        <StatCard
          label="Total Paid"
          value={formatCurrency(totalPaid)}
          sub={`${paid.length} completed`}
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
      </div>

      {/* Upcoming — grouped by month */}
      <div className="space-y-6">
        <h2 className="text-base font-semibold text-surface-0">
          Upcoming Payments
        </h2>

        {Object.keys(byMonth).length === 0 ? (
          <div className="rounded-xl border border-surface-600 py-12 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-surface-500 font-medium">No upcoming payments</p>
          </div>
        ) : (
          Object.entries(byMonth).map(([month, invoices]) => {
            const monthTotal = invoices.reduce((s, i) => s + i.amount, 0);
            return (
              <div key={month}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-surface-200">
                    {month}
                  </h3>
                  <span className="text-sm font-semibold text-surface-0">
                    {formatCurrency(monthTotal)}
                  </span>
                </div>
                <div className="space-y-2">
                  {invoices.map((inv) => {
                    const days = daysUntil(inv.dueDate);
                    const urgent = days <= 14;
                    const funded = inv.status === "funded";

                    return (
                      <div
                        key={inv.id}
                        className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${
                          urgent
                            ? "border-amber-200 bg-amber-50"
                            : "border-surface-600 bg-surface-700"
                        }`}
                      >
                        {/* Date bubble */}
                        <div className="text-center shrink-0 w-12">
                          <p className="text-xs text-surface-400 uppercase">
                            {new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short" })}
                          </p>
                          <p className="text-xl font-bold text-surface-0 leading-tight">
                            {new Date(inv.dueDate).getDate()}
                          </p>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-surface-0">
                              {inv.invoiceNumber}
                            </p>
                            {funded && (
                              <Badge variant="success">Funded</Badge>
                            )}
                            {!funded && (
                              <Badge variant="blue">Confirmed</Badge>
                            )}
                          </div>
                          <p className="text-xs text-surface-500 mt-0.5 truncate">
                            {inv.farmerName} · {inv.goods}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-bold text-surface-0">
                            {formatCurrency(inv.amount)}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              urgent ? "text-amber-600 font-medium" : "text-surface-400"
                            }`}
                          >
                            {urgent ? `${days} days left` : `in ${days} days`}
                          </p>
                        </div>

                        <Button variant="ghost" size="sm" asChild className="shrink-0">
                          <Link href={`/manufacturer/invoices/${inv.id}`}>View</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment history */}
      {paid.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All paid on time
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Invoice</th>
                  <th className="px-6 py-3 text-left font-medium">Supplier</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Paid On</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {paid.map((inv) => (
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
                      {formatDate(inv.paidDate ?? inv.dueDate)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="outline">Paid</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
