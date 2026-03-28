import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/PortalShell";
import { InvoiceProvider } from "@/lib/invoice-context";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/supplier", icon: "LayoutDashboard" },
  { label: "My Invoices", href: "/supplier/invoices", icon: "FileText" },
  { label: "Submit Invoice", href: "/supplier/invoices/new", icon: "PlusCircle" },
];

const BOTTOM_ITEMS = [
  { label: "Payment History", href: "/supplier/history", icon: "History" },
  { label: "Settings", href: "/supplier/settings", icon: "Settings" },
];

export default async function SupplierLayout({
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
      portalName="Supplier Portal"
      portalColor="bg-emerald-600"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName={userName}
      userRole="Supplier"
    >
      <InvoiceProvider>{children}</InvoiceProvider>
    </PortalShell>
  );
}
