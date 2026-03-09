import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

// Routes that require an authenticated session
const PROTECTED = ["/"];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/auth", "/login"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const pathname = request.nextUrl.pathname;

  // Refresh session on every request — keeps the cookie alive
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = PROTECTED.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Unauthenticated user on a protected route → send to /auth
  if (isProtected && !user) {
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(authUrl);
  }

  // Authenticated user on an auth route → send to dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api/ routes (handled per-route)
     * - onboarding/ routes (public — token-gated at page level)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|onboarding/).*)",
  ],
};
