import { PortalSidebar, type NavItem } from "./PortalSidebar";
import { PortalHeader } from "./PortalHeader";
import { Footer } from "./Footer";

interface PortalShellProps {
  children: React.ReactNode;
  portalName: string;
  portalColor: string;
  navItems: NavItem[];
  bottomItems?: NavItem[];
  userName?: string;
  userRole?: string;
}

export function PortalShell({
  children,
  portalName,
  portalColor,
  navItems,
  bottomItems,
  userName,
  userRole,
}: PortalShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-900">
      <PortalSidebar
        portalName={portalName}
        portalColor={portalColor}
        navItems={navItems}
        bottomItems={bottomItems}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PortalHeader userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <Footer compact />
      </div>
    </div>
  );
}
