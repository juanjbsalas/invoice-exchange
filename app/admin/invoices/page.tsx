"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const STATUS_FILTERS: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All",       value: "all"       },
  { label: "Submitted", value: "submitted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Funded",    value: "funded"    },
  { label: "Paid",      value: "paid"      },
  { label: "Disputed",  value: "disputed"  },
];

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  submitted: { label: "Submitted", variant: "warning"  },
  confirmed: { label: "Confirmed", variant: "blue"     },
  funded:    { label: "Funded",    variant: "success"  },
  paid:      { label: "Paid",      variant: "outline"  },
  disputed:  { label: "Disputed",  variant: "danger"   },
};

type SortKey = "date" | "amount" | "due" | "funded";

export default function AdminInvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState<SortKey>("date");
  const [overrides,    setOverrides]    = useState<Record<string, InvoiceStatus>>({});
  const [openMenu,     setOpenMenu]     = useState<string | null>(null);

  function overrideStatus(id: string, status: InvoiceStatus) {
    setOverrides((prev) => ({ ...prev, [id]: status }));
    setOpenMenu(null);
  }

  function effectiveStatus(inv: Invoice): InvoiceStatus {
    return overrides[inv.id] ?? inv.status;
  }

  let invoices = INVOICES.filter((inv) => {
    const es = effectiveStatus(inv);
    const matchStatus = statusFilter === "all" || es === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.farmerName.toLowerCase().includes(q) ||
      inv.storeName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  invoices = [...invoices].sort((a, b) => {
    if (sort === "amount") return b.amount - a.amount;
    if (sort === "due")    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sort === "funded") return b.fundedPercent - a.fundedPercent;
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  const totalVolume = invoices.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-0">Invoice Management</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {invoices.length} invoices · {formatCurrency(totalVolume)} total volume
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <Input
            placeholder="Search invoices, farmers, stores…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-slate-700 text-white"
                    : "bg-surface-600 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-md border border-surface-300 bg-white px-2.5 text-xs text-surface-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="date">Newest first</option>
            <option value="amount">Highest amount</option>
            <option value="due">Soonest due</option>
            <option value="funded">Most funded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FileText className="h-10 w-10 text-surface-300 mb-3" />
              <p className="text-surface-400 font-medium">No invoices match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                    <th className="px-5 py-3 text-left font-medium">Invoice</th>
                    <th className="px-5 py-3 text-left font-medium">Supplier</th>
                    <th className="px-5 py-3 text-left font-medium">Buyer</th>
                    <th className="px-5 py-3 text-left font-medium">Amount</th>
                    <th className="px-5 py-3 text-left font-medium">Issue Date</th>
                    <th className="px-5 py-3 text-left font-medium">Due Date</th>
                    <th className="px-5 py-3 text-left font-medium">Status</th>
                    <th className="px-5 py-3 text-left font-medium">Funded</th>
                    <th className="px-5 py-3 text-left font-medium">Fee</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {invoices.map((inv) => {
                    const es    = effectiveStatus(inv);
                    const badge = STATUS_BADGE[es] ?? { label: es, variant: "secondary" as const };
                    const days  = daysUntil(inv.dueDate);
                    const overridden = !!overrides[inv.id];

                    return (
                      <tr key={inv.id} className={`hover:bg-surface-800 transition-colors ${overridden ? "bg-violet-50/40" : ""}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-surface-0">{inv.invoiceNumber}</span>
                            {overridden && (
                              <span className="text-[10px] text-violet-600 font-medium bg-violet-100 rounded px-1">
                                overridden
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-surface-600 max-w-[130px] truncate">
                          {inv.farmerName}
                        </td>
                        <td className="px-5 py-3.5 text-surface-600 max-w-[130px] truncate">
                          {inv.storeName}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-surface-0">
                          {formatCurrency(inv.amount)}
                        </td>
                        <td className="px-5 py-3.5 text-surface-500">
                          {formatDate(inv.issueDate)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-sm ${es !== "paid" && days <= 14 ? "text-amber-600 font-medium" : "text-surface-500"}`}>
                            {formatDate(inv.dueDate)}
                            {es !== "paid" && <span className="text-xs ml-1 opacity-70">({days}d)</span>}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </td>
                        <td className="px-5 py-3.5 w-28">
                          <div className="space-y-1">
                            <Progress value={inv.fundedPercent} className="h-1.5" />
                            <p className="text-xs text-surface-400">{inv.fundedPercent}%</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-surface-500">
                          {formatCurrency(inv.platformFee)}
                        </td>
                        <td className="px-5 py-3.5 relative">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
                              className="flex items-center gap-1 rounded-md border border-surface-600 px-2 py-1.5 text-xs text-surface-600 hover:bg-surface-600 transition-colors"
                            >
                              Actions <ChevronDown className="h-3 w-3" />
                            </button>
                            {openMenu === inv.id && (
                              <div className="absolute right-0 top-8 z-20 w-44 rounded-lg border border-surface-600 bg-white shadow-lg py-1">
                                {(["submitted","confirmed","funded","paid","disputed"] as InvoiceStatus[])
                                  .filter((s) => s !== es)
                                  .map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => overrideStatus(inv.id, s)}
                                      className="w-full text-left px-3 py-2 text-xs text-surface-200 hover:bg-surface-800 capitalize transition-colors"
                                    >
                                      Mark as {s}
                                    </button>
                                  ))}
                                <hr className="my-1 border-surface-100" />
                                <button
                                  onClick={() => setOpenMenu(null)}
                                  className="w-full text-left px-3 py-2 text-xs text-surface-400 hover:bg-surface-800 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
