import { PortalShell } from "@/components/layout/PortalShell";

const NAV_ITEMS = [
  { label: "Home", href: "/investor", icon: "LayoutDashboard" },
  { label: "Browse Deals", href: "/investor/deals", icon: "TrendingUp" },
  { label: "Portfolio", href: "/investor/portfolio", icon: "Briefcase" },
  { label: "Activity", href: "/investor/activity", icon: "Activity" },
  { label: "Withdraw", href: "/investor/withdraw", icon: "ArrowDownToLine" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/investor/settings", icon: "Settings" },
];

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      portalName="Investor Portal"
      portalColor="bg-violet-600"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName="Alex Rivera"
      userRole="Investor"
    >
      {children}
    </PortalShell>
  );
}
