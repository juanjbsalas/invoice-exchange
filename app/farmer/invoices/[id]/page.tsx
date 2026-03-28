import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Users,
  DollarSign,
  Calendar,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

const STATUS_BADGE: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
  draft:     { label: "Draft",     variant: "secondary" },
  submitted: { label: "Submitted", variant: "warning"   },
  confirmed: { label: "Confirmed", variant: "blue"      },
  funded:    { label: "Funded",    variant: "success"   },
  paid:      { label: "Paid",      variant: "outline"   },
  disputed:  { label: "Disputed",  variant: "danger"    },
};

const TIMELINE_STEPS = [
  { key: "submitted", label: "Invoice Submitted",    sub: "Sent to buyer for confirmation" },
  { key: "confirmed", label: "Buyer Confirmed",      sub: "Buyer verified the invoice"     },
  { key: "funded",    label: "Fully Funded",         sub: "Investors funded the invoice"   },
  { key: "paid",      label: "Payment Received",     sub: "Buyer paid at maturity"         },
];

const STATUS_ORDER = ["draft", "submitted", "confirmed", "funded", "paid"];

function getStepState(stepKey: string, currentStatus: Invoice["status"]) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const stepIdx    = STATUS_ORDER.indexOf(stepKey);
  if (stepIdx < currentIdx)  return "done";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = INVOICES.find((i) => i.id === id);
  if (!inv) notFound();

  const badge = STATUS_BADGE[inv.status] ?? { label: inv.status, variant: "secondary" as const };
  const days = daysUntil(inv.dueDate);
  const fundedAmount = (inv.fundedPercent / 100) * inv.amount;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <Link
        href="/farmer/invoices"
        className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> My Invoices
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-surface-900">
              {inv.invoiceNumber}
            </h1>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="text-sm text-surface-500 mt-1">{inv.goods}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-surface-900">
            {formatCurrency(inv.amount)}
          </p>
          <p className="text-xs text-surface-400 mt-0.5">
            {inv.status !== "paid" && days > 0
              ? `Due in ${days} days`
              : `Due ${formatDate(inv.dueDate)}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Detail card */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { icon: Tag,      label: "Goods",        value: inv.goods },
                { icon: Users,    label: "Buyer",        value: inv.storeName },
                { icon: Calendar, label: "Issue Date",   value: formatDate(inv.issueDate) },
                { icon: Calendar, label: "Due Date",     value: formatDate(inv.dueDate) },
                { icon: DollarSign, label: "Platform Fee", value: formatCurrency(inv.platformFee) },
                { icon: DollarSign, label: "You Receive",  value: formatCurrency(inv.amount - inv.platformFee) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-md bg-surface-100 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-surface-500" />
                  </div>
                  <span className="text-surface-500 w-28 shrink-0">{label}</span>
                  <span className="font-medium text-surface-900">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Funding breakdown */}
          {(inv.status === "funded" || inv.status === "paid") && (
            <Card>
              <CardHeader>
                <CardTitle>Funding Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500">Funded by investors</span>
                    <span className="font-semibold text-surface-900">
                      {formatCurrency(fundedAmount)}{" "}
                      <span className="text-surface-400 font-normal">
                        / {formatCurrency(inv.amount)}
                      </span>
                    </span>
                  </div>
                  <Progress value={inv.fundedPercent} className="h-3" />
                  <p className="text-xs text-surface-400">
                    {inv.fundedPercent}% funded · {inv.totalInvestors} investor
                    {inv.totalInvestors !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <DollarSign className="h-4 w-4 text-brand-500" />
                  <span className="text-surface-600">
                    Yield rate offered to investors:{" "}
                    <span className="font-semibold text-surface-900">
                      {inv.yieldRate}% APY
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const state = getStepState(step.key, inv.status);
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  return (
                    <li key={step.key} className="flex gap-3">
                      {/* Connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            state === "done"
                              ? "bg-brand-600"
                              : state === "active"
                              ? "bg-brand-100 border-2 border-brand-500"
                              : "bg-surface-100 border border-surface-200"
                          }`}
                        >
                          {state === "done" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          ) : state === "active" ? (
                            <Clock className="h-3 w-3 text-brand-600" />
                          ) : (
                            <Circle className="h-3 w-3 text-surface-300" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 my-1 ${
                              state === "done"
                                ? "bg-brand-300"
                                : "bg-surface-200"
                            }`}
                            style={{ minHeight: 24 }}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="pb-5">
                        <p
                          className={`text-sm font-medium leading-tight ${
                            state === "pending"
                              ? "text-surface-400"
                              : "text-surface-900"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-surface-400 mt-0.5">
                          {step.sub}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          {inv.status === "submitted" && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
              Waiting for {inv.storeName} to confirm this invoice.
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/farmer/invoices">Back to Invoices</Link>
        </Button>
        {inv.status === "draft" && (
          <Button>Submit for Review</Button>
        )}
      </div>
    </div>
  );
}
