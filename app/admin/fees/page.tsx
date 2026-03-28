import { DollarSign, Receipt, TrendingUp, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function FeeLedgerPage() {
  // All invoices that have a fee record (submitted or beyond)
  const feeRecords = [...INVOICES]
    .filter((i) => i.status !== "draft")
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  const totalFees        = feeRecords.reduce((s, i) => s + i.platformFee, 0);
  const collectedFees    = feeRecords
    .filter((i) => i.status === "paid" || i.status === "funded")
    .reduce((s, i) => s + i.platformFee, 0);
  const pendingFees      = totalFees - collectedFees;
  const avgFeeRate       = feeRecords.length
    ? feeRecords.reduce((s, i) => s + i.platformFee / i.amount, 0) / feeRecords.length * 100
    : 0;

  const fmtRate = (v: number) => `${v.toPrecision(2)}%`;

  // Monthly fee breakdown
  const byMonth = feeRecords.reduce<Record<string, { fees: number; count: number; volume: number }>>(
    (acc, inv) => {
      const key = new Date(inv.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
      if (!acc[key]) acc[key] = { fees: 0, count: 0, volume: 0 };
      acc[key].fees   += inv.platformFee;
      acc[key].count  += 1;
      acc[key].volume += inv.amount;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-0">Fee Ledger</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Platform revenue from invoice transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Fees"
          value={formatCurrency(totalFees)}
          sub="all-time ledger"
          icon={DollarSign}
          iconColor="text-violet-500"
        />
        <StatCard
          label="Collected"
          value={formatCurrency(collectedFees)}
          sub="funded + paid invoices"
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <StatCard
          label="Pending"
          value={formatCurrency(pendingFees)}
          sub="awaiting invoice funding"
          icon={Receipt}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Avg Fee Rate"
          value={fmtRate(avgFeeRate)}
          sub="of invoice face value"
          icon={TrendingUp}
          iconColor="text-brand-600"
        />
      </div>

      {/* Monthly breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Month</th>
                <th className="px-6 py-3 text-left font-medium">Invoices</th>
                <th className="px-6 py-3 text-left font-medium">Invoice Volume</th>
                <th className="px-6 py-3 text-left font-medium">Fees Collected</th>
                <th className="px-6 py-3 text-left font-medium">Effective Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {Object.entries(byMonth).map(([month, data]) => (
                <tr key={month} className="hover:bg-surface-800 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-surface-0">{month}</td>
                  <td className="px-6 py-3.5 text-surface-600">{data.count}</td>
                  <td className="px-6 py-3.5 font-semibold text-surface-0">
                    {formatCurrency(data.volume)}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-brand-700">
                    {formatCurrency(data.fees)}
                  </td>
                  <td className="px-6 py-3.5 text-surface-600">
                    {fmtRate((data.fees / data.volume) * 100)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-surface-600 bg-surface-800">
                <td className="px-6 py-3.5 font-bold text-surface-0">Total</td>
                <td className="px-6 py-3.5 font-semibold text-surface-0">{feeRecords.length}</td>
                <td className="px-6 py-3.5 font-bold text-surface-0">
                  {formatCurrency(feeRecords.reduce((s, i) => s + i.amount, 0))}
                </td>
                <td className="px-6 py-3.5 font-bold text-brand-700">
                  {formatCurrency(totalFees)}
                </td>
                <td className="px-6 py-3.5 font-semibold text-surface-600">
                  {fmtRate(avgFeeRate)}
                </td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>

      {/* Per-transaction ledger */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Invoice</th>
                  <th className="px-6 py-3 text-left font-medium">Supplier</th>
                  <th className="px-6 py-3 text-left font-medium">Buyer</th>
                  <th className="px-6 py-3 text-left font-medium">Invoice Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Platform Fee</th>
                  <th className="px-6 py-3 text-left font-medium">Rate</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Collection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {feeRecords.map((inv) => {
                  const collected = inv.status === "paid" || inv.status === "funded";
                  return (
                    <tr key={inv.id} className="hover:bg-surface-800 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-surface-0">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-3.5 text-surface-600 max-w-[120px] truncate">
                        {inv.farmerName}
                      </td>
                      <td className="px-6 py-3.5 text-surface-600 max-w-[120px] truncate">
                        {inv.storeName}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-surface-0">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-brand-700">
                        {formatCurrency(inv.platformFee)}
                      </td>
                      <td className="px-6 py-3.5 text-surface-500">
                        {fmtRate((inv.platformFee / inv.amount) * 100)}
                      </td>
                      <td className="px-6 py-3.5 text-surface-500">
                        {formatDate(inv.issueDate)}
                      </td>
                      <td className="px-6 py-3.5">
                        {collected ? (
                          <Badge variant="success">Collected</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
