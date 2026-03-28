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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      portalName="Admin Portal"
      portalColor="bg-slate-700"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName="Platform Ops"
      userRole="Administrator"
    >
      {children}
    </PortalShell>
  );
}
