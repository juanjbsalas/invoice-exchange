"use client";

import Link from "next/link";
import { use, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Tag,
  User,
  Calendar,
  DollarSign,
  Info,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INVOICES, FARMERS } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  submitted: { label: "Needs Confirmation", variant: "warning"  },
  confirmed: { label: "Confirmed",          variant: "blue"     },
  funded:    { label: "Funded",             variant: "success"  },
  paid:      { label: "Paid",               variant: "outline"  },
  disputed:  { label: "Disputed",           variant: "danger"   },
};

export default function StoreInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const inv = INVOICES.find((i) => i.id === id);
  const [localStatus, setLocalStatus] = useState<"confirmed" | "disputed" | null>(null);

  if (!inv) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-surface-500 font-medium">Invoice not found</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/manufacturer/invoices">Back to Queue</Link>
        </Button>
      </div>
    );
  }

  const farmer = FARMERS.find((f) => f.id === inv.farmerId);
  const effectiveStatus = localStatus ?? inv.status;
  const badge = STATUS_BADGE[effectiveStatus] ?? { label: effectiveStatus, variant: "secondary" as const };
  const days = daysUntil(inv.dueDate);
  const isActionable = effectiveStatus === "submitted";

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/manufacturer/invoices"
        className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Invoice Queue
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-surface-0">
              {inv.invoiceNumber}
            </h1>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="text-sm text-surface-500 mt-1">{inv.goods}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-surface-0">
            {formatCurrency(inv.amount)}
          </p>
          <p className="text-xs text-surface-400 mt-0.5">
            {effectiveStatus !== "paid"
              ? `Due in ${days} days · ${formatDate(inv.dueDate)}`
              : `Paid ${formatDate(inv.paidDate ?? inv.dueDate)}`}
          </p>
        </div>
      </div>

      {/* Action banner */}
      {isActionable && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                This invoice is awaiting your confirmation
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Confirming allows <strong>{inv.farmerName}</strong> to receive
                funding immediately. You still pay the full amount of{" "}
                <strong>{formatCurrency(inv.amount)}</strong> on the due date (
                {formatDate(inv.dueDate)}). No early payment required.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setLocalStatus("disputed")}
            >
              <XCircle className="h-4 w-4" />
              Dispute Invoice
            </Button>
            <Button onClick={() => setLocalStatus("confirmed")}>
              <CheckCircle2 className="h-4 w-4" />
              Confirm Invoice
            </Button>
          </div>
        </div>
      )}

      {/* Confirmed feedback */}
      {localStatus === "confirmed" && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            Invoice confirmed. {inv.farmerName} will receive funding shortly.
          </p>
        </div>
      )}

      {localStatus === "disputed" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            Invoice disputed. Our team will review and follow up within 24 hours.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Invoice details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { icon: Tag,      label: "Goods",       value: inv.goods },
              { icon: Calendar, label: "Issue Date",  value: formatDate(inv.issueDate) },
              { icon: Calendar, label: "Due Date",    value: formatDate(inv.dueDate)   },
              { icon: DollarSign, label: "Amount",    value: formatCurrency(inv.amount) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-md bg-surface-600 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-surface-500" />
                </div>
                <span className="text-surface-500 w-24 shrink-0">{label}</span>
                <span className="font-medium text-surface-0">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Farmer info */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { icon: User,   label: "Supplier", value: inv.farmerName },
              { icon: MapPin, label: "Location", value: farmer?.location ?? "—" },
              {
                icon: CheckCircle2,
                label: "Invoices",
                value: `${farmer?.invoiceCount ?? 0} submitted to date`,
              },
              {
                icon: DollarSign,
                label: "Volume",
                value: formatCurrency(farmer?.totalInvoiced ?? 0),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-md bg-surface-600 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-surface-500" />
                </div>
                <span className="text-surface-500 w-24 shrink-0">{label}</span>
                <span className="font-medium text-surface-0">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/manufacturer/invoices">Back to Queue</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/manufacturer/schedule">View Schedule</Link>
        </Button>
      </div>
    </div>
  );
}
