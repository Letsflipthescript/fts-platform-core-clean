import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Creates a Supabase client that can read and write cookies inside
 * Next.js middleware. Returns both the client and the (possibly mutated)
 * response so middleware can forward updated Set-Cookie headers.
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response };
}
