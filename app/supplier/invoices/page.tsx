"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useInvoices } from "@/lib/invoice-context";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

const FARMER_ID = "f1";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Funded", value: "funded" },
  { label: "Paid", value: "paid" },
];

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  draft:     { label: "Draft",     variant: "secondary" },
  submitted: { label: "Submitted", variant: "warning"   },
  confirmed: { label: "Confirmed", variant: "blue"      },
  funded:    { label: "Funded",    variant: "success"   },
  paid:      { label: "Paid",      variant: "outline"   },
  disputed:  { label: "Disputed",  variant: "danger"    },
};

export default function FarmerInvoicesPage() {
  const { invoices } = useInvoices();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const all = invoices.filter((i) => i.farmerId === FARMER_ID);

  const filtered = all.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesSearch =
      search === "" ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.storeName.toLowerCase().includes(search.toLowerCase()) ||
      inv.goods.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-0">My Invoices</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {all.length} invoices total
          </p>
        </div>
        <Button asChild>
          <Link href="/supplier/invoices/new">
            <PlusCircle className="h-4 w-4" />
            Submit Invoice
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <Input
            placeholder="Search invoices…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-600 text-surface-600 hover:bg-surface-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-10 w-10 text-surface-300 mb-3" />
          <p className="text-surface-500 font-medium">No invoices found</p>
          <p className="text-surface-400 text-sm mt-1">
            Try adjusting your filters or submit a new invoice.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <InvoiceRow key={inv.id} inv={inv} />
          ))}
        </div>
      )}
    </div>
  );
}

function InvoiceRow({ inv }: { inv: Invoice }) {
  const badge = STATUS_BADGE[inv.status] ?? { label: inv.status, variant: "secondary" as const };
  const days = daysUntil(inv.dueDate);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Icon */}
          <div className="h-10 w-10 rounded-lg bg-surface-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-surface-400" />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-surface-0 text-sm">
                {inv.invoiceNumber}
              </span>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="text-sm text-surface-500 mt-0.5 truncate">
              {inv.goods} · {inv.storeName}
            </p>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <p className="font-bold text-surface-0">
              {formatCurrency(inv.amount)}
            </p>
            <p className="text-xs text-surface-400 mt-0.5">
              Due {formatDate(inv.dueDate)}
              {inv.status !== "paid" && days > 0 && ` · ${days}d`}
            </p>
          </div>

          {/* Funding bar (only for funded) */}
          {inv.status === "funded" && (
            <div className="w-28 shrink-0">
              <div className="flex justify-between text-xs text-surface-500 mb-1">
                <span>Funded</span>
                <span>{inv.fundedPercent}%</span>
              </div>
              <Progress value={inv.fundedPercent} />
            </div>
          )}

          {/* Action */}
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href={`/supplier/invoices/${inv.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
