import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./app/lib/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // protects the "/transactions","/dashboard" route and its sub-routes
  if (!user && (request.nextUrl.pathname.startsWith("/transactions") || request.nextUrl.pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/","/dashboard", "/transactions"],
};
