import { PortalShell } from "@/components/layout/PortalShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/store", icon: "LayoutDashboard" },
  { label: "Invoice Queue", href: "/store/invoices", icon: "ClipboardCheck" },
  { label: "Payment Schedule", href: "/store/schedule", icon: "CalendarClock" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/store/settings", icon: "Settings" },
];

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      portalName="Store Portal"
      portalColor="bg-blue-600"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName="Jordan Lee"
      userRole="Fresh Market Co."
    >
      {children}
    </PortalShell>
  );
}
