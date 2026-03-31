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

interface CompanyProfile {
  description: string;
  founded: number;
  headquarters: string;
  industry: string;
  employees: string;
  cashFlow: { period: string; operating: number; investing: number; financing: number }[];
  paymentBehavior: { onTimeRate: number; avgDaysEarly: number; streakMonths: number; history: ("on-time" | "late" | "early")[] };
  roe: { current: number; prior: number };
  creditGrade: string;
  creditOutlook: string;
  creditFactors: string[];
}

const COMPANY_PROFILES: Record<string, CompanyProfile> = {
  s1: {
    description: "Fresh Market Co. is a premium regional grocery chain specializing in farm-fresh produce and artisanal goods across the Bay Area. Known for its long-standing supplier relationships and above-average customer retention.",
    founded: 2001,
    headquarters: "San Francisco, CA",
    industry: "Specialty Grocery Retail",
    employees: "1,200–1,500",
    cashFlow: [
      { period: "Q1 2026", operating: 1_840_000, investing: -310_000, financing: -120_000 },
      { period: "Q4 2025", operating: 2_110_000, investing: -420_000, financing: -95_000 },
      { period: "Q3 2025", operating: 1_760_000, investing: -280_000, financing: -140_000 },
    ],
    paymentBehavior: { onTimeRate: 98, avgDaysEarly: 2, streakMonths: 24, history: ["early","on-time","early","on-time","early","on-time","early","on-time","on-time","on-time","early","on-time"] },
    roe: { current: 18.4, prior: 16.9 },
    creditGrade: "AA-",
    creditOutlook: "Stable",
    creditFactors: ["Consistent on-time payment history", "Strong operating cash flow", "Low debt-to-equity ratio", "Diversified supplier base"],
  },
  s2: {
    description: "Valley Grocers is a community-oriented grocery chain serving Oakland and the East Bay since 1988. The company focuses on value pricing and neighborhood accessibility with 8 locations.",
    founded: 1988,
    headquarters: "Oakland, CA",
    industry: "Community Grocery Retail",
    employees: "600–800",
    cashFlow: [
      { period: "Q1 2026", operating: 920_000,  investing: -180_000, financing: -60_000 },
      { period: "Q4 2025", operating: 1_050_000, investing: -210_000, financing: -80_000 },
      { period: "Q3 2025", operating: 870_000,  investing: -150_000, financing: -55_000 },
    ],
    paymentBehavior: { onTimeRate: 94, avgDaysEarly: 1, streakMonths: 14, history: ["on-time","on-time","late","on-time","on-time","on-time","early","on-time","on-time","on-time","on-time","on-time"] },
    roe: { current: 14.2, prior: 13.1 },
    creditGrade: "BBB+",
    creditOutlook: "Stable",
    creditFactors: ["Solid payment history with minor delays", "Moderate cash flow seasonality", "Stable revenue base", "Single-market concentration risk"],
  },
  s3: {
    description: "NatureMart is a fast-growing organic and natural foods specialty chain with 12 locations across the South Bay. Targets health-conscious consumers with certified organic inventory exceeding 85%.",
    founded: 2008,
    headquarters: "San Jose, CA",
    industry: "Organic & Natural Foods Retail",
    employees: "900–1,100",
    cashFlow: [
      { period: "Q1 2026", operating: 1_340_000, investing: -520_000, financing: -200_000 },
      { period: "Q4 2025", operating: 1_580_000, investing: -610_000, financing: -175_000 },
      { period: "Q3 2025", operating: 1_190_000, investing: -490_000, financing: -220_000 },
    ],
    paymentBehavior: { onTimeRate: 97, avgDaysEarly: 3, streakMonths: 18, history: ["early","early","on-time","early","on-time","on-time","early","early","on-time","early","on-time","early"] },
    roe: { current: 21.6, prior: 19.2 },
    creditGrade: "A",
    creditOutlook: "Positive",
    creditFactors: ["Excellent payment consistency", "High-growth revenue trajectory", "Expanding store footprint", "Premium margin profile"],
  },
  s4: {
    description: "Harvest Table is a boutique farm-to-table specialty grocer in Berkeley, operating 3 curated locations. Strong community brand and loyal customer base with a focus on hyper-local sourcing.",
    founded: 2015,
    headquarters: "Berkeley, CA",
    industry: "Boutique Specialty Grocery",
    employees: "120–180",
    cashFlow: [
      { period: "Q1 2026", operating: 310_000, investing: -75_000,  financing: -30_000 },
      { period: "Q4 2025", operating: 370_000, investing: -90_000,  financing: -25_000 },
      { period: "Q3 2025", operating: 290_000, investing: -60_000,  financing: -35_000 },
    ],
    paymentBehavior: { onTimeRate: 91, avgDaysEarly: 0, streakMonths: 9, history: ["on-time","late","on-time","on-time","on-time","late","on-time","on-time","early","on-time","on-time","on-time"] },
    roe: { current: 12.8, prior: 10.4 },
    creditGrade: "BBB",
    creditOutlook: "Stable",
    creditFactors: ["Growing payment track record", "Smaller revenue base", "Improving cash flow trend", "Limited geographic diversification"],
  },
};
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
          <h1 className="text-2xl font-bold text-surface-0">You&apos;re invested!</h1>
          <p className="text-surface-500 mt-2">
            Your {formatCurrency(amount)} is now working for you.
          </p>
        </div>

        <div className="rounded-2xl border border-surface-600 bg-surface-800 p-6 space-y-3 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-surface-500">Invested</span>
            <span className="font-semibold text-surface-0">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Expected earnings</span>
            <span className="font-semibold text-green-600">+{formatCurrency(earning)}</span>
          </div>
          <div className="border-t border-surface-600 pt-3 flex justify-between">
            <span className="font-semibold text-surface-0">You get back</span>
            <span className="font-bold text-surface-0 text-base">{formatCurrency(total)}</span>
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
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-surface-0">Confirm Investment</h1>
          <p className="text-sm text-surface-500 mt-1">Review before you confirm.</p>
        </div>

        <Card>
          <CardContent className="pt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Deal</span>
              <span className="font-medium text-surface-0">{deal.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">You invest</span>
              <span className="font-medium text-surface-0">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Expected earnings</span>
              <span className="font-semibold text-green-600">+{formatCurrency(earning)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">APY</span>
              <span className="font-medium text-surface-0">{deal.yieldRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Maturity date</span>
              <span className="font-medium text-surface-0">{formatDate(deal.dueDate)} ({days} days)</span>
            </div>
            <div className="border-t border-surface-100 pt-3 flex justify-between">
              <span className="font-semibold text-surface-0">Total return</span>
              <span className="font-bold text-surface-0 text-base">{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2.5 rounded-lg bg-surface-800 border border-surface-600 p-3 text-xs text-surface-500">
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/investor/deals"
        className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Browse Deals
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-0">{deal.storeName}</h1>
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
                <span className="font-semibold text-surface-0">
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
                  <div className="h-7 w-7 rounded-md bg-surface-600 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-surface-500" />
                  </div>
                  <span className="text-surface-500 w-24 shrink-0">{label}</span>
                  <span className="font-medium text-surface-0">{value}</span>
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
              <div key={label} className="flex items-start gap-3 rounded-xl border border-surface-600 p-4">
                <Icon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-surface-0">{label}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Company profile sections */}
          {(() => {
            const profile = COMPANY_PROFILES[deal.storeId] ?? null;
            if (!profile) return null;

            const SP_PRIME  = ["AAA","AA+","AA","AA-"];
            const SP_HIGH   = ["A+","A","A-"];
            const SP_MED    = ["BBB+","BBB","BBB-"];

            const gradeColor =
              SP_PRIME.includes(profile.creditGrade) ? "text-emerald-600" :
              SP_HIGH.includes(profile.creditGrade)  ? "text-green-600" :
              SP_MED.includes(profile.creditGrade)   ? "text-blue-600" : "text-amber-600";

            const scoreBg =
              SP_PRIME.includes(profile.creditGrade) ? "bg-emerald-50 border-emerald-200" :
              SP_HIGH.includes(profile.creditGrade)  ? "bg-green-50 border-green-200" :
              SP_MED.includes(profile.creditGrade)   ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200";

            const ratingDesc =
              SP_PRIME.includes(profile.creditGrade) ? "Prime — exceptionally low default risk" :
              SP_HIGH.includes(profile.creditGrade)  ? "Strong — very low default risk" :
              SP_MED.includes(profile.creditGrade)   ? "Investment grade — moderate default risk" :
                                                       "Speculative — elevated default risk";

            return (
              <>
                {/* Company Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Company Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-surface-600 leading-relaxed">{profile.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { label: "Founded",        value: String(profile.founded) },
                        { label: "Headquarters",   value: profile.headquarters },
                        { label: "Industry",       value: profile.industry },
                        { label: "Employees",      value: profile.employees },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-surface-400 mb-0.5">{label}</p>
                          <p className="font-medium text-surface-0">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cash Flow */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cash Flow Statements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.cashFlow.map((cf) => (
                        <div key={cf.period} className="rounded-lg border border-surface-100 p-3">
                          <p className="text-xs font-semibold text-surface-500 mb-2">{cf.period}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs text-center">
                            <div>
                              <p className="text-surface-400 mb-0.5">Operating</p>
                              <p className="font-semibold text-green-600">
                                +${(cf.operating / 1_000_000).toFixed(2)}M
                              </p>
                            </div>
                            <div>
                              <p className="text-surface-400 mb-0.5">Investing</p>
                              <p className="font-semibold text-surface-200">
                                ${(cf.investing / 1_000_000).toFixed(2)}M
                              </p>
                            </div>
                            <div>
                              <p className="text-surface-400 mb-0.5">Financing</p>
                              <p className="font-semibold text-surface-200">
                                ${(cf.financing / 1_000_000).toFixed(2)}M
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Behavior */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Behavior</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center text-sm">
                      <div className="rounded-lg bg-surface-800 p-3">
                        <p className="text-xs text-surface-400 mb-1">On-Time Rate</p>
                        <p className="text-xl font-bold text-green-600">{profile.paymentBehavior.onTimeRate}%</p>
                      </div>
                      <div className="rounded-lg bg-surface-800 p-3">
                        <p className="text-xs text-surface-400 mb-1">Avg Days Early</p>
                        <p className="text-xl font-bold text-surface-0">{profile.paymentBehavior.avgDaysEarly}d</p>
                      </div>
                      <div className="rounded-lg bg-surface-800 p-3">
                        <p className="text-xs text-surface-400 mb-1">Streak</p>
                        <p className="text-xl font-bold text-violet-600">{profile.paymentBehavior.streakMonths}mo</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-surface-400 mb-2">Last 12 payments</p>
                      <div className="flex gap-1">
                        {profile.paymentBehavior.history.map((h, i) => (
                          <div
                            key={i}
                            title={h}
                            className={`flex-1 h-5 rounded-sm ${
                              h === "early"   ? "bg-green-500" :
                              h === "on-time" ? "bg-blue-400" : "bg-red-400"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-4 mt-2 text-[10px] text-surface-400">
                        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500" /> Early</span>
                        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-400" /> On-time</span>
                        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" /> Late</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Return on Equity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Return on Equity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-end gap-4">
                      <div>
                        <p className="text-xs text-surface-400 mb-0.5">Current ROE</p>
                        <p className="text-3xl font-bold text-surface-0">{profile.roe.current}%</p>
                      </div>
                      <div className="mb-1">
                        <p className="text-xs text-surface-400 mb-0.5">vs Prior Year</p>
                        <p className={`text-sm font-semibold ${profile.roe.current >= profile.roe.prior ? "text-green-600" : "text-red-500"}`}>
                          {profile.roe.current >= profile.roe.prior ? "▲" : "▼"} {Math.abs(profile.roe.current - profile.roe.prior).toFixed(1)}pp
                        </p>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-600 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${Math.min(profile.roe.current * 3, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-surface-400">Industry average ROE: ~14–16% for specialty grocery</p>
                  </CardContent>
                </Card>

                {/* Creditworthiness */}
                <Card>
                  <CardHeader>
                    <CardTitle>Creditworthiness</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`flex items-center gap-4 rounded-xl border p-4 ${scoreBg}`}>
                      <p className={`text-4xl font-black tracking-tight ${gradeColor}`}>{profile.creditGrade}</p>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-surface-0">S&amp;P Rating</p>
                          <span className="text-xs font-medium text-surface-500">Outlook: {profile.creditOutlook}</span>
                        </div>
                        <p className="text-xs text-surface-500 mt-0.5">{ratingDesc}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-surface-400 mb-2">Key factors</p>
                      <ul className="space-y-1.5">
                        {profile.creditFactors.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-surface-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}
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
                    className="h-10 w-10 rounded-lg border border-surface-600 flex items-center justify-center hover:bg-surface-600 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-surface-500" />
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">$</span>
                    <input
                      type="number"
                      value={inputAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="h-10 w-full rounded-lg border border-surface-300 pl-7 pr-3 text-sm font-semibold text-surface-0 focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                    />
                  </div>
                  <button
                    onClick={() => nudge(100)}
                    className="h-10 w-10 rounded-lg border border-surface-600 flex items-center justify-center hover:bg-surface-600 transition-colors"
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
                        : "border-surface-600 text-surface-600 hover:bg-surface-800"
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
                  <span className="font-semibold text-surface-0">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Earnings</span>
                  <span className="font-semibold text-green-600">+{formatCurrency(earning)}</span>
                </div>
                <div className="border-t border-green-200 pt-2 flex justify-between">
                  <span className="font-semibold text-surface-0">You receive</span>
                  <span className="font-bold text-surface-0">{formatCurrency(total)}</span>
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
