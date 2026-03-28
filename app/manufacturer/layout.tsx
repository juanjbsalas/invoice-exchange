import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/PortalShell";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/manufacturer", icon: "LayoutDashboard" },
  { label: "Invoice Queue", href: "/manufacturer/invoices", icon: "ClipboardCheck" },
  { label: "Payment Schedule", href: "/manufacturer/schedule", icon: "CalendarClock" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/manufacturer/settings", icon: "Settings" },
];

export default async function ManufacturerLayout({
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
      portalName="Manufacturer Portal"
      portalColor="bg-blue-600"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      userName={userName}
      userRole="Manufacturer"
    >
      {children}
    </PortalShell>
  );
}
