"use client";

import Link from "next/link";
import { Bell, ChevronDown, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortalHeaderProps {
  userName?: string;
  userRole?: string;
  pageTitle?: string;
}

export function PortalHeader({
  userName = "Demo User",
  userRole = "User",
  pageTitle,
}: PortalHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-surface-700 bg-surface-800 px-6">
      {/* Page title */}
      <div>
        {pageTitle && (
          <h1 className="text-base font-semibold text-surface-0">
            {pageTitle}
          </h1>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
        </Button>

        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-700 cursor-pointer transition-colors">
          <div className="h-7 w-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-surface-0 leading-tight">
              {userName}
            </p>
            <p className="text-xs text-surface-400">{userRole}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
        </div>

        <Button variant="ghost" size="icon-sm" asChild className="text-surface-400 hover:text-surface-0 ml-1">
          <Link href="/"><Home className="h-4 w-4" /></Link>
        </Button>

        <form action="/api/auth/signout" method="post">
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            className="text-surface-400 hover:text-red-400 ml-1"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
