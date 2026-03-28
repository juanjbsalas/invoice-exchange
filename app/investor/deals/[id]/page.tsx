"use client";

import Link from "next/link";
import { use, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Tag,
  Users,
  Info,
  Minus,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { INVOICES, DEMO_INVESTOR } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

type Step = "detail" | "confirm" | "success";

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const deal = INVOICES.find((i) => i.id === id);

  const [step,        setStep]        = useState<Step>("detail");
  const [amount,      setAmount]      = useState(500);
  const [inputAmount, setInputAmount] = useState("500");

  if (!deal || (deal.status !== "confirmed" && deal.status !== "funded") || deal.fundedPercent >= 100) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
        <p className="text-surface-500 font-medium">Deal not available</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/investor/deals">Browse Deals</Link>
        </Button>
      </div>
    );
  }

  const days          = daysUntil(deal.dueDate);
  const maxAvailable  = Math.floor(deal.amount * (1 - deal.fundedPercent / 100));
  const available     = Math.min(maxAvailable, DEMO_INVESTOR.balance);

  // Yield calculation: amount × (rate/100) × (days/365)
  const earning       = amount * (deal.yieldRate / 100) * (days / 365);
  const total         = amount + earning;

  function handleAmountChange(val: string) {
    setInputAmount(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) setAmount(Math.min(n, available));
  }

  function nudge(delta: number) {
    const next = Math.max(100, Math.min(amount + delta, available));
    setAmount(next);
    setInputAmount(String(next));
  }

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">You&apos;re invested!</h1>
          <p className="text-surface-500 mt-2">
            Your {formatCurrency(amount)} is now working for you.
          </p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 space-y-3 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-surface-500">Invested</span>
            <span className="font-semibold text-surface-900">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Expected earnings</span>
            <span className="font-semibold text-green-600">+{formatCurrency(earning)}</span>
          </div>
          <div className="border-t border-surface-200 pt-3 flex justify-between">
            <span className="font-semibold text-surface-900">You get back</span>
            <span className="font-bold text-surface-900 text-base">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-xs text-surface-400 pt-1">
            <span>Maturity date</span>
            <span>{formatDate(deal.dueDate)}</span>
          </div>
        </div>

        <p className="text-xs text-surface-400">
          We&apos;ll notify you when the payment is received. Your earnings are
          added to your balance automatically.
        </p>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/investor/portfolio">View Portfolio</Link>
          </Button>
          <Button asChild>
            <Link href="/investor/deals">Browse More Deals</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <button
          onClick={() => setStep("detail")}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-surface-900">Confirm Investment</h1>
          <p className="text-sm text-surface-500 mt-1">Review before you confirm.</p>
        </div>

        <Card>
          <CardContent className="pt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Deal</span>
              <span className="font-medium text-surface-900">{deal.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">You invest</span>
              <span className="font-medium text-surface-900">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Expected earnings</span>
              <span className="font-semibold text-green-600">+{formatCurrency(earning)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">APY</span>
              <span className="font-medium text-surface-900">{deal.yieldRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Maturity date</span>
              <span className="font-medium text-surface-900">{formatDate(deal.dueDate)} ({days} days)</span>
            </div>
            <div className="border-t border-surface-100 pt-3 flex justify-between">
              <span className="font-semibold text-surface-900">Total return</span>
              <span className="font-bold text-surface-900 text-base">{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2.5 rounded-lg bg-surface-50 border border-surface-200 p-3 text-xs text-surface-500">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          Funds are held until the manufacturer pays the invoice at maturity.
          This is not FDIC insured — please only invest what you can afford to hold.
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("detail")}>
            Edit
          </Button>
          <Button className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => setStep("success")}>
            Confirm Investment
          </Button>
        </div>
      </div>
    );
  }

  // step === "detail"
  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/investor/deals"
        className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Browse Deals
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{deal.storeName}</h1>
          <p className="text-sm text-surface-500 mt-1">{deal.goods}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl font-bold text-green-600">{deal.yieldRate}%</p>
          <p className="text-xs text-surface-400 -mt-0.5">APY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Left: deal info */}
        <div className="md:col-span-3 space-y-5">
          {/* Funding progress */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Funded so far</span>
                <span className="font-semibold text-surface-900">
                  {formatCurrency(deal.amount * deal.fundedPercent / 100)}{" "}
                  <span className="text-surface-400 font-normal">/ {formatCurrency(deal.amount)}</span>
                </span>
              </div>
              <Progress value={deal.fundedPercent} className="h-3" />
              <div className="flex justify-between text-xs text-surface-400">
                <span>{deal.fundedPercent}% filled · {deal.totalInvestors} investors</span>
                <span>{formatCurrency(deal.amount * (1 - deal.fundedPercent / 100))} remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Deal details */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { icon: Tag,      label: "Goods",       value: deal.goods },
                { icon: Users,    label: "Buyer",       value: deal.storeName },
                { icon: Users,    label: "Supplier",     value: deal.farmerName },
                { icon: Calendar, label: "Issue Date",  value: formatDate(deal.issueDate) },
                { icon: Calendar, label: "Maturity",    value: `${formatDate(deal.dueDate)} (${days} days)` },
                { icon: TrendingUp, label: "Total Deal", value: formatCurrency(deal.amount) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-md bg-surface-100 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-surface-500" />
                  </div>
                  <span className="text-surface-500 w-24 shrink-0">{label}</span>
                  <span className="font-medium text-surface-900">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, label: "Asset-backed",    sub: "Secured by confirmed invoice" },
              { icon: CheckCircle2, label: "Buyer confirmed", sub: "Store verified the delivery" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-surface-200 p-4">
                <Icon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-surface-900">{label}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: invest widget */}
        <div className="md:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Invest in This Deal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount input */}
              <div>
                <label className="text-xs text-surface-500 font-medium mb-1.5 block">
                  Amount
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => nudge(-100)}
                    className="h-10 w-10 rounded-lg border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-surface-500" />
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">$</span>
                    <input
                      type="number"
                      value={inputAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="h-10 w-full rounded-lg border border-surface-300 pl-7 pr-3 text-sm font-semibold text-surface-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                    />
                  </div>
                  <button
                    onClick={() => nudge(100)}
                    className="h-10 w-10 rounded-lg border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-surface-500" />
                  </button>
                </div>
                <p className="text-xs text-surface-400 mt-1.5 text-center">
                  Available: {formatCurrency(available)}
                </p>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 2500].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setAmount(Math.min(n, available)); setInputAmount(String(Math.min(n, available))); }}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors min-w-12 ${
                      amount === n
                        ? "border-violet-400 bg-violet-50 text-violet-700"
                        : "border-surface-200 text-surface-600 hover:bg-surface-50"
                    }`}
                  >
                    ${n >= 1000 ? `${n/1000}k` : n}
                  </button>
                ))}
              </div>

              {/* Yield preview */}
              <div className="rounded-xl bg-green-50 border border-green-100 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-600">You invest</span>
                  <span className="font-semibold text-surface-900">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Earnings</span>
                  <span className="font-semibold text-green-600">+{formatCurrency(earning)}</span>
                </div>
                <div className="border-t border-green-200 pt-2 flex justify-between">
                  <span className="font-semibold text-surface-900">You receive</span>
                  <span className="font-bold text-surface-900">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-surface-400 text-center pt-1">
                  at maturity in {days} days
                </p>
              </div>

              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={amount < 100}
                onClick={() => setStep("confirm")}
              >
                Invest {formatCurrency(amount)}
              </Button>

              <p className="text-[11px] text-surface-400 text-center leading-relaxed">
                Min. investment $100. Not FDIC insured. Returns are not guaranteed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
