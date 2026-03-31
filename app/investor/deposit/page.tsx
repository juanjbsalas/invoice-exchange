"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Building2,
  Info,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_INVESTOR } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

type Step = "form" | "confirm" | "success";

const BANK_ACCOUNTS = [
  { id: "ba1", label: "Chase ••••4821", type: "Checking" },
  { id: "ba2", label: "Bank of America ••••7203", type: "Savings" },
];

export default function DepositPage() {
  const [step,   setStep]   = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [bankId, setBankId] = useState("ba1");

  const balance     = DEMO_INVESTOR.balance;
  const numAmount   = parseFloat(amount) || 0;
  const isValid     = numAmount >= 10;
  const selectedBank = BANK_ACCOUNTS.find((b) => b.id === bankId)!;

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-0">Deposit Initiated</h1>
          <p className="text-surface-500 mt-2">
            {formatCurrency(numAmount)} is on its way to your invoiceXchange account.
          </p>
        </div>

        <Card>
          <CardContent className="pt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Amount</span>
              <span className="font-semibold text-surface-0">{formatCurrency(numAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">From</span>
              <span className="font-medium text-surface-0">{selectedBank.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Estimated arrival</span>
              <span className="font-medium text-surface-0">1–3 business days</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-xs text-surface-500 justify-center">
          <Clock className="h-3.5 w-3.5" />
          Funds will be available in your balance within 1–3 business days.
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/investor/activity">View Activity</Link>
          </Button>
          <Button asChild>
            <Link href="/investor">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-surface-0">Confirm Deposit</h1>
          <p className="text-sm text-surface-500 mt-1">Review before sending.</p>
        </div>

        <Card>
          <CardContent className="pt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Amount</span>
              <span className="font-bold text-surface-0 text-base">
                {formatCurrency(numAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">From account</span>
              <span className="font-medium text-surface-0">{selectedBank.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Type</span>
              <span className="font-medium text-surface-0">{selectedBank.type}</span>
            </div>
            <div className="flex justify-between border-t border-surface-100 pt-3">
              <span className="text-surface-500">New balance (est.)</span>
              <span className="font-medium text-surface-0">
                {formatCurrency(balance + numAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2.5 rounded-lg bg-surface-800 border border-surface-600 p-3 text-xs text-surface-500">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          ACH transfers take 1–3 business days to clear. You cannot cancel once initiated.
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>
            Edit
          </Button>
          <Button className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={() => setStep("success")}>
            Confirm Deposit
          </Button>
        </div>
      </div>
    );
  }

  // step === "form"
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <Link
          href="/investor"
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <h1 className="text-2xl font-bold text-surface-0">Deposit Funds</h1>
        <p className="text-sm text-surface-500 mt-1">
          Add funds from your bank account to start investing.
        </p>
      </div>

      {/* Balance display */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 p-6 text-white text-center">
        <p className="text-sm text-white/70 mb-1">Current balance</p>
        <p className="text-4xl font-bold tracking-tight">
          {formatCurrency(balance)}
        </p>
        <p className="text-xs text-white/50 mt-2">
          Deposited funds are available to invest after clearing
        </p>
      </div>

      <Card>
        <CardContent className="pt-5 space-y-5">
          {/* Bank account selector */}
          <div className="space-y-2">
            <Label>Deposit from</Label>
            <div className="space-y-2">
              {BANK_ACCOUNTS.map((bank) => (
                <label
                  key={bank.id}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                    bankId === bank.id
                      ? "border-violet-400 bg-violet-50"
                      : "border-surface-600 hover:bg-surface-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="bank"
                    value={bank.id}
                    checked={bankId === bank.id}
                    onChange={() => setBankId(bank.id)}
                    className="accent-violet-600"
                  />
                  <div className="h-8 w-8 rounded-lg bg-surface-600 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-surface-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-0">{bank.label}</p>
                    <p className="text-xs text-surface-400">{bank.type}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">
                $
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-7 text-lg font-semibold"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {numAmount > 0 && numAmount < 10 && (
              <p className="text-xs text-amber-600">Minimum deposit is $10.</p>
            )}
            <div className="flex gap-2 pt-1">
              {[100, 500, 1000, 5000].map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(String(n))}
                  className="flex-1 rounded-lg border border-surface-600 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-800 transition-colors"
                >
                  ${n >= 1000 ? `${n / 1000}k` : n}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full bg-violet-600 hover:bg-violet-700"
        disabled={!isValid}
        onClick={() => setStep("confirm")}
      >
        Continue
      </Button>

      <p className="text-xs text-surface-400 text-center">
        Funds arrive in 1–3 business days via ACH. No deposit fees.
      </p>
    </div>
  );
}
