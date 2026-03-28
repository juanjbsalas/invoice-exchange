import { PortalShell } from "@/components/layout/PortalShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/farmer", icon: "LayoutDashboard" },
  { label: "My Invoices", href: "/farmer/invoices", icon: "FileText" },
  { label: "Submit Invoice", href: "/farmer/invoices/new", icon: "PlusCircle" },
];

const BOTTOM_ITEMS = [
  { label: "Payment History", href: "/farmer/history", icon: "History" },
  { label: "Settings", href: "/farmer/settings", icon: "Settings" },
];

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      portalName="Farmer Portal"
      portalColor="bg-emerald-600"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName="Maria Santos"
      userRole="Sunrise Valley Farm"
    >
      {children}
    </PortalShell>
  );
}
