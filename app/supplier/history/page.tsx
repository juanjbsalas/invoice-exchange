import Link from "next/link";
import { CheckCircle2, FileText, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const FARMER_ID = "f1";

export default function PaymentHistoryPage() {
  const paid = INVOICES.filter(
    (i) => i.farmerId === FARMER_ID && i.status === "paid"
  ).sort(
    (a, b) =>
      new Date(b.paidDate ?? b.dueDate).getTime() -
      new Date(a.paidDate ?? a.dueDate).getTime()
  );

  const totalPaid = paid.reduce((s, i) => s + i.amount, 0);
  const totalFees = paid.reduce((s, i) => s + i.platformFee, 0);
  const netReceived = totalPaid - totalFees;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-0">Payment History</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          All completed invoice payments
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Invoices Paid"
          value={String(paid.length)}
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <StatCard
          label="Total Paid Out"
          value={formatCurrency(totalPaid)}
          icon={DollarSign}
          iconColor="text-brand-600"
        />
        <StatCard
          label="Net Received"
          value={formatCurrency(netReceived)}
          sub={`After ${formatCurrency(totalFees)} in fees`}
          icon={TrendingUp}
          iconColor="text-violet-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Payments</CardTitle>
        </CardHeader>
        {paid.length === 0 ? (
          <CardContent>
            <p className="text-sm text-surface-400 text-center py-10">
              No completed payments yet.
            </p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Invoice</th>
                  <th className="px-6 py-3 text-left font-medium">Buyer</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Fee</th>
                  <th className="px-6 py-3 text-left font-medium">Net</th>
                  <th className="px-6 py-3 text-left font-medium">Paid On</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {paid.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-surface-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-surface-300 shrink-0" />
                        <span className="font-medium text-surface-0">
                          {inv.invoiceNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-600">
                      {inv.storeName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-surface-0">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-6 py-4 text-surface-500">
                      −{formatCurrency(inv.platformFee)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-700">
                      {formatCurrency(inv.amount - inv.platformFee)}
                    </td>
                    <td className="px-6 py-4 text-surface-500">
                      {formatDate(inv.paidDate ?? inv.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/supplier/invoices/${inv.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        )}
      </Card>

      {/* Summary */}
      {paid.length > 0 && (
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-5 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-surface-600">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            All {paid.length} payments completed on time
          </div>
          <Badge variant="success">100% on-time</Badge>
        </div>
      )}
    </div>
  );
}
