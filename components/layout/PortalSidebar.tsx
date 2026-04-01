"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  History,
  Settings,
  ClipboardCheck,
  CalendarClock,
  Briefcase,
  TrendingUp,
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Receipt,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  PlusCircle,
  History,
  Settings,
  ClipboardCheck,
  CalendarClock,
  Briefcase,
  TrendingUp,
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Receipt,
};

export interface NavItem {
  label: string;
  href: string;
  icon: string; // icon name key into ICON_MAP
}

interface PortalSidebarProps {
  portalName: string;
  portalColor: string;
  navItems: NavItem[];
  bottomItems?: NavItem[];
}

export function PortalSidebar({
  portalName,
  portalColor,
  navItems,
  bottomItems = [],
}: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-surface-700 bg-surface-900">
      {/* Portal header strip */}
      <div className={cn("flex items-center gap-3 px-5 py-5", portalColor)}>
        <div>
          <div className="flex items-center">
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">invoice</span>
              <Image src="/logo.png" alt="X" width={20} height={20} className="mx-0.5 inline-block [filter:brightness(0)_saturate(100%)_invert(52%)_sepia(100%)_saturate(1000%)_hue-rotate(85deg)_brightness(1.4)]" />
              <span className="text-xs font-medium text-white/60 uppercase tracking-widest">change</span>
            </div>
          <p className="text-sm font-semibold text-white leading-tight">
            {portalName}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {bottomItems.length > 0 && (
        <>
          <Separator className="bg-surface-700" />
          <nav className="flex flex-col gap-0.5 px-3 py-4">
            {bottomItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        </>
      )}
    </aside>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-[#00C805]/12 text-[#00C805]"
          : "text-surface-400 hover:bg-surface-800 hover:text-surface-100"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-[#00C805]" : "text-surface-500"
        )}
      />
      {item.label}
    </Link>
  );
}
