import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TypedApiResponse } from "./lib/api/types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const { data, error } = await supabaseClient.auth.getSession();

  if (data.session?.user) {
    return res;
  }

  const status = 401;

  const response: TypedApiResponse = {
    statusCode: status,
    errorMessage: "Unauthorized",
    result: "ERROR",
  };

  return Response.json(response, { status });
}

export const config = {
  matcher: "/api/:path*",
};
