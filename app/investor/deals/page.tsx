"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { INVOICES } from "@/lib/mock-data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Soonest maturity", value: "soonest" },
  { label: "Highest yield",    value: "yield"   },
  { label: "Most funded",      value: "funded"  },
  { label: "Largest deal",     value: "largest" },
];

export default function BrowseDealsPage() {
  const [search, setSearch]   = useState("");
  const [sort,   setSort]     = useState("soonest");
  const [showFilters, setShowFilters] = useState(false);

  // Available = confirmed or funded-but-not-full
  let deals = INVOICES.filter(
    (i) =>
      (i.status === "confirmed" || i.status === "funded") &&
      i.fundedPercent < 100
  );

  if (search) {
    const q = search.toLowerCase();
    deals = deals.filter(
      (d) =>
        d.storeName.toLowerCase().includes(q) ||
        d.goods.toLowerCase().includes(q) ||
        d.farmerName.toLowerCase().includes(q)
    );
  }

  deals = [...deals].sort((a, b) => {
    if (sort === "soonest") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sort === "yield")   return b.yieldRate - a.yieldRate;
    if (sort === "funded")  return b.fundedPercent - a.fundedPercent;
    if (sort === "largest") return b.amount - a.amount;
    return 0;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Browse Deals</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {deals.length} deal{deals.length !== 1 ? "s" : ""} available · Earn up to{" "}
          <span className="font-semibold text-green-600">8.5% APY</span>
        </p>
      </div>

      {/* Search + sort */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <Input
            placeholder="Search by store, crop, farmer…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-surface-300 bg-white px-3 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters((v) => !v)}
            className={showFilters ? "bg-surface-100" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* How it works hint */}
      <div className="rounded-xl bg-violet-50 border border-violet-100 px-5 py-4 text-sm text-violet-700 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <span>
          You earn a flat <strong>8% APY</strong> on every deal. When the store
          pays the invoice at maturity, you get your money back plus earnings —
          automatically.
        </span>
      </div>

      {/* Deal cards */}
      {deals.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-surface-400 font-medium">No deals match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {deals.map((deal) => {
            const remaining  = deal.amount * (1 - deal.fundedPercent / 100);
            const days       = daysUntil(deal.dueDate);
            const isHot      = deal.fundedPercent >= 70;
            const isNew      = deal.fundedPercent < 20;

            return (
              <Link
                key={deal.id}
                href={`/investor/deals/${deal.id}`}
                className="group flex flex-col rounded-2xl border border-surface-200 bg-surface-0 p-5 hover:border-violet-300 hover:shadow-md transition-all"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-surface-900">
                        {deal.storeName}
                      </p>
                      {isHot && (
                        <Badge variant="warning" className="text-[10px]">
                          🔥 Filling fast
                        </Badge>
                      )}
                      {isNew && (
                        <Badge variant="blue" className="text-[10px]">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">
                      {deal.goods}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-green-600">
                      {deal.yieldRate}%
                    </p>
                    <p className="text-[10px] text-surface-400 -mt-0.5">APY</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="rounded-lg bg-surface-50 px-2 py-2">
                    <p className="text-xs text-surface-400">Total</p>
                    <p className="text-sm font-semibold text-surface-900 mt-0.5">
                      {formatCurrency(deal.amount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-50 px-2 py-2">
                    <p className="text-xs text-surface-400">Available</p>
                    <p className="text-sm font-semibold text-surface-900 mt-0.5">
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-50 px-2 py-2">
                    <p className="text-xs text-surface-400">Matures</p>
                    <p className="text-sm font-semibold text-surface-900 mt-0.5">
                      {days}d
                    </p>
                  </div>
                </div>

                {/* Funding progress */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between text-xs text-surface-500">
                    <span>{deal.fundedPercent}% funded</span>
                    <span>{deal.totalInvestors} investor{deal.totalInvestors !== 1 ? "s" : ""}</span>
                  </div>
                  <Progress value={deal.fundedPercent} />
                </div>

                {/* Maturity date */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-100">
                  <span className="text-xs text-surface-400">
                    Due {formatDate(deal.dueDate)}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:gap-2 transition-all">
                    Invest <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
