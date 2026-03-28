import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/PortalShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Invoices", href: "/admin/invoices", icon: "FileText" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Deals", href: "/admin/deals", icon: "Briefcase" },
  { label: "Fee Ledger", href: "/admin/fees", icon: "Receipt" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const meta = user.user_metadata ?? {};
  const userName =
    [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "User";

  return (
    <PortalShell
      portalName="Admin Portal"
      portalColor="bg-slate-700"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName={userName}
      userRole="Administrator"
    >
      {children}
    </PortalShell>
  );
}
