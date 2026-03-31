"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GROCERY_STORES } from "@/lib/mock-data";
import { useInvoices } from "@/lib/invoice-context";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

type Step = "form" | "review" | "success";

interface FormData {
  storeId: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  goods: string;
  description: string;
  fileName: string;
}

const EMPTY_FORM: FormData = {
  storeId: "",
  amount: "",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  goods: "",
  description: "",
  fileName: "",
};

export default function SubmitInvoicePage() {
  const { addInvoice } = useInvoices();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [farmerFullName, setFarmerFullName] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata ?? {};
      const name =
        [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
        data.user?.email ||
        "";
      setFarmerFullName(name);
    });
  }, []);

  const selectedStore = GROCERY_STORES.find((s) => s.id === form.storeId);
  const amount = parseFloat(form.amount) || 0;
  const platformFee = parseFloat((amount * 0.00001).toFixed(2));
  const youReceive = amount - platformFee;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, fileName: file.name }));
  }

  const isFormValid =
    form.storeId && form.amount && form.dueDate && form.goods;

  function handleSubmit() {
    addInvoice({
      id: `new-${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      farmerId: "f1",
      farmerName: farmerFullName,
      storeId: form.storeId,
      storeName: selectedStore?.name ?? "",
      amount,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: "submitted",
      goods: form.goods,
      description: form.description || undefined,
      yieldRate: 8,
      platformFee,
      fundedPercent: 0,
      totalInvestors: 0,
    });
    setStep("success");
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-0">
            Invoice Submitted!
          </h1>
          <p className="text-surface-500 mt-2">
            Your invoice has been submitted for review. Once the buyer confirms,
            it will be listed for investor funding.
          </p>
        </div>
        <Card>
          <CardContent className="pt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">Buyer</span>
              <span className="font-medium text-surface-0">
                {selectedStore?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Invoice Amount</span>
              <span className="font-medium text-surface-0">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Platform Fee (0.001%)</span>
              <span className="text-surface-600">
                −{formatCurrency(platformFee)}
              </span>
            </div>
            <div className="border-t border-surface-100 pt-3 flex justify-between">
              <span className="font-semibold text-surface-0">
                You Receive
              </span>
              <span className="font-bold text-brand-700 text-base">
                {formatCurrency(youReceive)}
              </span>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/supplier/invoices">View My Invoices</Link>
          </Button>
          <Button
            onClick={() => {
              setForm(EMPTY_FORM);
              setStep("form");
            }}
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Edit
        </button>

        <div>
          <h1 className="text-2xl font-bold text-surface-0">
            Review & Submit
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Confirm the details before submitting.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { label: "Buyer", value: selectedStore?.name },
              { label: "Goods", value: form.goods },
              { label: "Invoice Date", value: form.issueDate },
              { label: "Due Date", value: form.dueDate },
              form.fileName ? { label: "Attached Document", value: form.fileName } : null,
            ]
              .filter(Boolean)
              .map((row) => (
                <div key={row!.label} className="flex justify-between">
                  <span className="text-surface-500">{row!.label}</span>
                  <span className="font-medium text-surface-0 text-right max-w-xs">
                    {row!.value}
                  </span>
                </div>
              ))}
            <div className="border-t border-surface-100 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-500">Invoice Amount</span>
                <span className="font-semibold text-surface-0">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Platform Fee (0.001%)</span>
                <span className="text-surface-600">
                  −{formatCurrency(platformFee)}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-surface-0">
                  You Receive
                </span>
                <span className="font-bold text-brand-700 text-base">
                  {formatCurrency(youReceive)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700">
            Once submitted, the buyer will be notified to confirm this invoice.
            You&apos;ll receive funds as soon as it&apos;s fully funded by investors.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setStep("form")}
          >
            Edit
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Submit Invoice
          </Button>
        </div>
      </div>
    );
  }

  // step === "form"
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link
          href="/supplier/invoices"
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> My Invoices
        </Link>
        <h1 className="text-2xl font-bold text-surface-0">Submit Invoice</h1>
        <p className="text-sm text-surface-500 mt-1">
          Fill in the details below and get funded within 24 hours.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Buyer */}
          <div className="space-y-1.5">
            <Label htmlFor="storeId">Buyer (Manufacturer)</Label>
            <select
              id="storeId"
              name="storeId"
              value={form.storeId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-sm text-surface-0 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select a manufacturer…</option>
              {GROCERY_STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.location}
                </option>
              ))}
            </select>
          </div>

          {/* Goods */}
          <div className="space-y-1.5">
            <Label htmlFor="goods">Goods Delivered</Label>
            <Input
              id="goods"
              name="goods"
              placeholder="e.g. Organic Strawberries (1,200 lbs)"
              value={form.goods}
              onChange={handleChange}
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Invoice Amount ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">
                $
              </span>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={form.amount}
                onChange={handleChange}
              />
            </div>
            {amount > 0 && (
              <p className="text-xs text-surface-400">
                Platform fee 0.001% ={" "}
                <span className="text-surface-600 font-medium">
                  {formatCurrency(platformFee)}
                </span>
                {" · "}You receive{" "}
                <span className="text-brand-700 font-semibold">
                  {formatCurrency(youReceive)}
                </span>
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={form.issueDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Payment Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Additional Notes{" "}
              <span className="text-surface-400 font-normal">(optional)</span>
            </Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Any notes for the buyer or platform…"
              value={form.description}
              onChange={handleChange}
              className="flex w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-sm text-surface-0 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Upload */}
          <div className="space-y-1.5">
            <Label>
              Supporting Document{" "}
              <span className="text-surface-400 font-normal">(optional)</span>
            </Label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-600 p-6 cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors">
              {form.fileName ? (
                <>
                  <FileText className="h-6 w-6 text-brand-500" />
                  <span className="text-sm font-medium text-brand-700">
                    {form.fileName}
                  </span>
                  <span className="text-xs text-surface-400">
                    Click to replace
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-surface-400" />
                  <span className="text-sm text-surface-500">
                    Click to upload PDF or image
                  </span>
                  <span className="text-xs text-surface-400">
                    Max 10 MB
                  </span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        disabled={!isFormValid}
        onClick={() => setStep("review")}
      >
        Review Invoice
      </Button>
    </div>
  );
}
