import { TrendingUp, CheckCircle2, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INVESTMENTS, DEMO_INVESTOR } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface ActivityItem {
  id:      string;
  type:    "invested" | "returned" | "deposit" | "withdrawal";
  label:   string;
  sub:     string;
  amount:  number;
  date:    string;
  badge?:  string;
}

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const meta = user.user_metadata ?? {};
  const userName =
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "User";

  // Build a chronological feed from mock investments
  const items: ActivityItem[] = [];

  // Deposit event (seed)
  items.push({
    id:     "deposit-1",
    type:   "deposit",
    label:  "Funds Added",
    sub:    "Initial deposit",
    amount: 10000,
    date:   "2025-10-01",
  });

  // Investment events
  INVESTMENTS.forEach((inv) => {
    items.push({
      id:    `inv-${inv.id}`,
      type:  "invested",
      label: `Invested in ${inv.invoiceNumber}`,
      sub:   inv.storeName,
      amount: -inv.amount,
      date:  inv.investedDate,
      badge: `${inv.yieldRate}% APY`,
    });
    if (inv.status === "matured" && inv.actualReturn) {
      items.push({
        id:    `ret-${inv.id}`,
        type:  "returned",
        label: `${inv.invoiceNumber} matured`,
        sub:   `${inv.storeName} · principal + earnings`,
        amount: inv.actualReturn,
        date:  inv.maturityDate,
      });
    }
  });

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const ICON_MAP = {
    invested:   { icon: TrendingUp,       bg: "bg-violet-100", color: "text-violet-600" },
    returned:   { icon: CheckCircle2,     bg: "bg-green-100",  color: "text-green-600"  },
    deposit:    { icon: ArrowUpFromLine,  bg: "bg-blue-100",   color: "text-blue-600"   },
    withdrawal: { icon: ArrowDownToLine,  bg: "bg-amber-100",  color: "text-amber-600"  },
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-0">Activity</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {userName} · all transactions
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Invested",   value: formatCurrency(DEMO_INVESTOR.totalInvested), color: "text-violet-600" },
          { label: "Earned",     value: `+${formatCurrency(DEMO_INVESTOR.totalEarned)}`, color: "text-green-600" },
          { label: "Balance",    value: formatCurrency(DEMO_INVESTOR.balance), color: "text-surface-0" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-surface-600 bg-surface-700 p-4 text-center">
            <p className="text-xs text-surface-400 mb-1">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ol className="divide-y divide-surface-100">
            {items.map((item) => {
              const { icon: Icon, bg, color } = ICON_MAP[item.type];
              const isPositive = item.amount > 0;

              return (
                <li key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-800 transition-colors">
                  <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-surface-0">{item.label}</p>
                      {item.badge && (
                        <Badge variant="secondary" className="text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-surface-400 mt-0.5">{item.sub}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-semibold ${
                        isPositive ? "text-green-600" : "text-surface-0"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(Math.abs(item.amount))}
                    </p>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
