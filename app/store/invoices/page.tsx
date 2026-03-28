"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/lib/types";

const STORE_ID = "s1";

const TABS: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All",               value: "all"      },
  { label: "Needs Confirmation", value: "submitted" },
  { label: "Confirmed",          value: "confirmed" },
  { label: "Funded",             value: "funded"    },
  { label: "Paid",               value: "paid"      },
];

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  submitted: { label: "Needs Confirmation", variant: "warning"  },
  confirmed: { label: "Confirmed",          variant: "blue"     },
  funded:    { label: "Funded",             variant: "success"  },
  paid:      { label: "Paid",               variant: "outline"  },
  disputed:  { label: "Disputed",           variant: "danger"   },
};

export default function InvoiceQueuePage() {
  const [tab, setTab] = useState<InvoiceStatus | "all">("all");
  // Track locally confirmed/disputed invoice ids (cosmetic)
  const [confirmed, setConfirmed]  = useState<Set<string>>(new Set());
  const [disputed,  setDisputed]   = useState<Set<string>>(new Set());
  const [expanded,  setExpanded]   = useState<Set<string>>(new Set());

  const base = INVOICES.filter((i) => i.storeId === STORE_ID);

  const display = base.filter((i) => {
    if (tab === "all") return true;
    // override status if locally acted on
    if (confirmed.has(i.id)) return tab === "confirmed";
    if (disputed.has(i.id))  return tab === "disputed";
    return i.status === tab;
  });

  function getEffectiveStatus(inv: Invoice): Invoice["status"] {
    if (confirmed.has(inv.id)) return "confirmed";
    if (disputed.has(inv.id))  return "disputed";
    return inv.status;
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const pendingCount = base.filter(
    (i) => i.status === "submitted" && !confirmed.has(i.id) && !disputed.has(i.id)
  ).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Invoice Queue</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {pendingCount > 0
            ? `${pendingCount} invoice${pendingCount !== 1 ? "s" : ""} awaiting your confirmation`
            : "All invoices reviewed"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap border-b border-surface-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              tab === t.value
                ? "bg-blue-600 text-white"
                : "bg-surface-100 text-surface-600 hover:bg-surface-200"
            }`}
          >
            {t.label}
            {t.value === "submitted" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-white/30 px-1.5 py-0.5 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Invoice cards */}
      {display.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-10 w-10 text-surface-300 mb-3" />
          <p className="text-surface-500 font-medium">No invoices in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {display.map((inv) => {
            const effectiveStatus = getEffectiveStatus(inv);
            const badge = STATUS_BADGE[effectiveStatus] ?? { label: effectiveStatus, variant: "secondary" as const };
            const isSubmitted = effectiveStatus === "submitted";
            const isOpen = expanded.has(inv.id);
            const days = daysUntil(inv.dueDate);

            return (
              <Card key={inv.id} className={isSubmitted ? "border-amber-200" : ""}>
                <CardContent className="p-0">
                  {/* Main row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSubmitted ? "bg-amber-100" : "bg-surface-100"
                      }`}
                    >
                      {isSubmitted ? (
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-surface-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-surface-900 text-sm">
                          {inv.invoiceNumber}
                        </span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className="text-xs text-surface-500 mt-0.5 truncate">
                        {inv.farmerName} · {inv.goods}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-surface-900">
                        {formatCurrency(inv.amount)}
                      </p>
                      <p className={`text-xs mt-0.5 ${days <= 14 && effectiveStatus !== "paid" ? "text-amber-600 font-medium" : "text-surface-400"}`}>
                        Due {formatDate(inv.dueDate)}
                        {effectiveStatus !== "paid" && ` · ${days}d`}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(inv.id)}
                      className="ml-2 text-surface-400 hover:text-surface-600 transition-colors shrink-0"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t border-surface-100 px-5 py-4 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        {[
                          { label: "Farmer",     value: inv.farmerName   },
                          { label: "Goods",      value: inv.goods        },
                          { label: "Issue Date", value: formatDate(inv.issueDate) },
                          { label: "Due Date",   value: formatDate(inv.dueDate)   },
                          { label: "Amount",     value: formatCurrency(inv.amount) },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-xs text-surface-400 mb-0.5">{label}</p>
                            <p className="font-medium text-surface-900">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Actions — only for submitted */}
                      {isSubmitted && (
                        <div className="flex items-center gap-3 pt-2 border-t border-surface-100">
                          <p className="text-xs text-surface-500 flex-1">
                            Confirming allows this farmer to receive funding immediately.
                            You still pay on your normal due date.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setDisputed((prev) => new Set([...prev, inv.id]));
                              setExpanded((prev) => { const n = new Set(prev); n.delete(inv.id); return n; });
                            }}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Dispute
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setConfirmed((prev) => new Set([...prev, inv.id]));
                              setExpanded((prev) => { const n = new Set(prev); n.delete(inv.id); return n; });
                            }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Confirm Invoice
                          </Button>
                        </div>
                      )}

                      {/* Link to detail */}
                      {!isSubmitted && (
                        <div className="pt-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/store/invoices/${inv.id}`}>
                              Full Details →
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
