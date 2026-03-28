import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Stub middleware — in production this would verify session tokens
// and redirect unauthenticated users to login.
// For the MVP demo, all routes are open and role selection happens via the landing page.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/farmer/:path*", "/store/:path*", "/investor/:path*", "/admin/:path*"],
};
