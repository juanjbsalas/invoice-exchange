"use client";

import { useState } from "react";
import { Search, Sprout, ShoppingCart, TrendingUp, UserX, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FARMERS, GROCERY_STORES, DEMO_INVESTOR, PLATFORM_STATS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

type Tab = "farmers" | "stores" | "investors";

// Expand demo investor into a small list for display
const MOCK_INVESTORS = [
  { id: "i1", name: "Alex Rivera",     balance: 7250,  totalInvested: 5750,  active: 3, status: "active"    },
  { id: "i2", name: "Sam Chen",        balance: 12400, totalInvested: 11000, active: 5, status: "active"    },
  { id: "i3", name: "Priya Nair",      balance: 3100,  totalInvested: 2500,  active: 1, status: "active"    },
  { id: "i4", name: "Jordan Williams", balance: 500,   totalInvested: 0,     active: 0, status: "pending"   },
  { id: "i5", name: "Taylor Brooks",   balance: 0,     totalInvested: 8000,  active: 0, status: "suspended" },
];

export default function AdminUsersPage() {
  const [tab,       setTab]       = useState<Tab>("farmers");
  const [search,    setSearch]    = useState("");
  const [suspended, setSuspended] = useState<Set<string>>(new Set());

  function toggleSuspend(id: string) {
    setSuspended((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const TABS: { value: Tab; label: string; icon: typeof Sprout; count: number }[] = [
    { value: "farmers",   label: "Suppliers",     icon: Sprout,       count: FARMERS.length         },
    { value: "stores",    label: "Manufacturers", icon: ShoppingCart, count: GROCERY_STORES.length  },
    { value: "investors", label: "Investors",     icon: TrendingUp,   count: PLATFORM_STATS.totalInvestors },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">User Management</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Suppliers, manufacturers, and investors
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-surface-200 pb-3">
        {TABS.map(({ value, label, icon: Icon, count }) => (
          <button
            key={value}
            onClick={() => { setTab(value); setSearch(""); }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === value
                ? "bg-slate-700 text-white"
                : "bg-surface-100 text-surface-600 hover:bg-surface-200"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              tab === value ? "bg-white/20 text-white" : "bg-surface-200 text-surface-500"
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
        <Input
          placeholder={`Search ${tab}…`}
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Farmers */}
      {tab === "farmers" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Supplier</th>
                  <th className="px-6 py-3 text-left font-medium">Location</th>
                  <th className="px-6 py-3 text-left font-medium">Invoices</th>
                  <th className="px-6 py-3 text-left font-medium">Total Invoiced</th>
                  <th className="px-6 py-3 text-left font-medium">Total Funded</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {FARMERS.filter((f) =>
                  !search || f.name.toLowerCase().includes(search.toLowerCase())
                ).map((f) => {
                  const isSuspended = suspended.has(f.id);
                  return (
                    <tr key={f.id} className={`hover:bg-surface-50 transition-colors ${isSuspended ? "opacity-60" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Sprout className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-surface-900">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-600">{f.location}</td>
                      <td className="px-6 py-4 text-surface-700">{f.invoiceCount}</td>
                      <td className="px-6 py-4 font-semibold text-surface-900">{formatCurrency(f.totalInvoiced)}</td>
                      <td className="px-6 py-4 font-semibold text-brand-700">{formatCurrency(f.totalFunded)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={isSuspended ? "danger" : "success"}>
                          {isSuspended ? "Suspended" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className={isSuspended ? "border-green-200 text-green-700 hover:bg-green-50" : "border-red-200 text-red-600 hover:bg-red-50"}
                          onClick={() => toggleSuspend(f.id)}
                        >
                          {isSuspended ? (
                            <><CheckCircle2 className="h-3.5 w-3.5" /> Reinstate</>
                          ) : (
                            <><UserX className="h-3.5 w-3.5" /> Suspend</>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Stores */}
      {tab === "stores" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Store</th>
                  <th className="px-6 py-3 text-left font-medium">Location</th>
                  <th className="px-6 py-3 text-left font-medium">Pending</th>
                  <th className="px-6 py-3 text-left font-medium">Total Owed</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {GROCERY_STORES.filter((s) =>
                  !search || s.name.toLowerCase().includes(search.toLowerCase())
                ).map((s) => {
                  const isSuspended = suspended.has(s.id);
                  return (
                    <tr key={s.id} className={`hover:bg-surface-50 transition-colors ${isSuspended ? "opacity-60" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <ShoppingCart className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-surface-900">{s.name}</p>
                            {s.chain && <p className="text-xs text-surface-400">{s.chain} chain</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-600">{s.location}</td>
                      <td className="px-6 py-4">
                        {s.pendingConfirmations > 0 ? (
                          <Badge variant="warning">{s.pendingConfirmations} pending</Badge>
                        ) : (
                          <span className="text-surface-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-surface-900">{formatCurrency(s.totalOwed)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={isSuspended ? "danger" : "success"}>
                          {isSuspended ? "Suspended" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className={isSuspended ? "border-green-200 text-green-700 hover:bg-green-50" : "border-red-200 text-red-600 hover:bg-red-50"}
                          onClick={() => toggleSuspend(s.id)}
                        >
                          {isSuspended ? (
                            <><CheckCircle2 className="h-3.5 w-3.5" /> Reinstate</>
                          ) : (
                            <><UserX className="h-3.5 w-3.5" /> Suspend</>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Investors */}
      {tab === "investors" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100 text-xs text-surface-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Investor</th>
                  <th className="px-6 py-3 text-left font-medium">Balance</th>
                  <th className="px-6 py-3 text-left font-medium">Total Invested</th>
                  <th className="px-6 py-3 text-left font-medium">Active Deals</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {MOCK_INVESTORS.filter((i) =>
                  !search || i.name.toLowerCase().includes(search.toLowerCase())
                ).map((inv) => {
                  const isSuspended = suspended.has(inv.id) || inv.status === "suspended";
                  const isPending   = inv.status === "pending" && !suspended.has(inv.id);
                  return (
                    <tr key={inv.id} className={`hover:bg-surface-50 transition-colors ${isSuspended ? "opacity-60" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-sm font-bold text-violet-600">
                            {inv.name.charAt(0)}
                          </div>
                          <span className="font-medium text-surface-900">{inv.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-surface-900">{formatCurrency(inv.balance)}</td>
                      <td className="px-6 py-4 font-semibold text-surface-900">{formatCurrency(inv.totalInvested)}</td>
                      <td className="px-6 py-4 text-surface-700">{inv.active}</td>
                      <td className="px-6 py-4">
                        {isSuspended ? (
                          <Badge variant="danger">Suspended</Badge>
                        ) : isPending ? (
                          <Badge variant="warning">Pending KYC</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className={isSuspended ? "border-green-200 text-green-700 hover:bg-green-50" : "border-red-200 text-red-600 hover:bg-red-50"}
                          onClick={() => toggleSuspend(inv.id)}
                        >
                          {isSuspended ? (
                            <><CheckCircle2 className="h-3.5 w-3.5" /> Reinstate</>
                          ) : (
                            <><UserX className="h-3.5 w-3.5" /> Suspend</>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
