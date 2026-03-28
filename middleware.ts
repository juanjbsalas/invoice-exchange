import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_PATHS: Record<string, string> = {
  supplier: "/supplier",
  manufacturer: "/manufacturer",
  investor: "/investor",
  admin: "/admin",
};

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = user.user_metadata?.user_category as string | undefined;
  const allowedBase = role ? ROLE_PATHS[role] : null;
  const pathname = request.nextUrl.pathname;

  if (allowedBase && !pathname.startsWith(allowedBase)) {
    return NextResponse.redirect(new URL(allowedBase, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/supplier/:path*",
    "/manufacturer/:path*",
    "/investor/:path*",
    "/admin/:path*",
  ],
};
