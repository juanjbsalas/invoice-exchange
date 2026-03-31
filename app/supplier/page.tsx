"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FARMERS } from "@/lib/mock-data";
import { useInvoices } from "@/lib/invoice-context";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

const FARMER_ID = "f1";

function getStatusBadge(status: Invoice["status"]) {
  const map: Record<string, { label: string; variant: "secondary" | "warning" | "blue" | "success" | "outline" | "danger" }> = {
    draft:     { label: "Draft",     variant: "secondary" },
    submitted: { label: "Submitted", variant: "warning"   },
    confirmed: { label: "Confirmed", variant: "blue"      },
    funded:    { label: "Funded",    variant: "success"   },
    paid:      { label: "Paid",      variant: "outline"   },
    disputed:  { label: "Disputed",  variant: "danger"    },
  };
  return map[status] ?? { label: status, variant: "secondary" as const };
}

export default function FarmerDashboardPage() {
  const { invoices } = useInvoices();
  const farmer = FARMERS.find((f) => f.id === FARMER_ID)!;
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata ?? {};
      setFirstName(meta.first_name ?? data.user?.email ?? "");
    });
  }, []);
  const myInvoices = invoices.filter((inv) => inv.farmerId === FARMER_ID);
  const recent = myInvoices.slice(0, 5);

  const pendingCount = myInvoices.filter(
    (i) => i.status === "submitted" || i.status === "confirmed"
  ).length;
  const activeTotal = myInvoices
    .filter((i) => i.status === "funded")
    .reduce((sum, i) => sum + i.amount, 0);
  const paidTotal = myInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const nextDue = myInvoices
    .filter((i) => i.status === "funded" && daysUntil(i.dueDate) > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-0">
            Good morning, {firstName || "…"}
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {farmer.name} · {farmer.location}
          </p>
        </div>
        <Button asChild>
          <Link href="/supplier/invoices/new">
            <PlusCircle className="h-4 w-4" />
            Submit Invoice
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Review"
          value={String(pendingCount)}
          sub="awaiting funding"
          icon={Clock}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Currently Funded"
          value={formatCurrency(activeTotal)}
          sub="across active invoices"
          icon={TrendingUp}
          iconColor="text-brand-600"
        />
        <StatCard
          label="Total Paid Out"
          value={formatCurrency(paidTotal)}
          sub="lifetime"
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <StatCard
          label="Next Payment Due"
          value={nextDue ? formatDate(nextDue.dueDate) : "—"}
          sub={
            nextDue
              ? `${daysUntil(nextDue.dueDate)} days · ${nextDue.storeName}`
              : "No upcoming payments"
          }
          icon={DollarSign}
          iconColor="text-violet-500"
        />
      </div>

      {/* Funding progress strip */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lifetime Funding</CardTitle>
            <span className="text-sm text-surface-500">
              {Math.round((farmer.totalFunded / farmer.totalInvoiced) * 100)}% funded
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Funded</span>
              <span className="font-semibold text-surface-0">
                {formatCurrency(farmer.totalFunded)}{" "}
                <span className="font-normal text-surface-400">
                  of {formatCurrency(farmer.totalInvoiced)}
                </span>
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-surface-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{
                  width: `${(farmer.totalFunded / farmer.totalInvoiced) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-surface-400">
              {farmer.invoiceCount} invoices submitted since joining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/supplier/invoices" className="flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Invoice</th>
                <th className="px-6 py-3 text-left font-medium">Buyer</th>
                <th className="px-6 py-3 text-left font-medium">Amount</th>
                <th className="px-6 py-3 text-left font-medium">Due Date</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {recent.map((inv) => {
                const badge = getStatusBadge(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-surface-800 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-surface-300 shrink-0" />
                        <span className="font-medium text-surface-0">
                          {inv.invoiceNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-600">{inv.storeName}</td>
                    <td className="px-6 py-4 font-semibold text-surface-0">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-6 py-4 text-surface-500">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/supplier/invoices/${inv.id}`}>View</Link>
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
