import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TypedApiResponse } from "./lib/api/types";
import { verifyTokenAuth } from "./lib/api/utils/auth";
import { verifySupabaseAuth } from "./lib/api/utils/auth";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  let isMissingAuth = false;

  const isSupabaseAuth = await verifySupabaseAuth(req, res);

  if (isSupabaseAuth) {
    return res;
  }

  const authHeader = req.headers.get("Authorization");

  if (authHeader) {
    const authHeaderSplit = authHeader.split(" ");
    if (
      authHeaderSplit.length === 2 &&
      authHeaderSplit[0].toLowerCase().trim() === "bearer" &&
      authHeaderSplit[1].trim().length > 0
    ) {
      try {
        const token = authHeaderSplit[1].trim();
        await verifyTokenAuth(token);

        return res;
      } catch (error: any) {
        isMissingAuth = true;
      }
    }
  }

  isMissingAuth = true;

  if (isMissingAuth) {
    const status = 401;
    const response: TypedApiResponse = {
      statusCode: status,
      errorMessage: "Authentication required",
      result: "ERROR",
    };
    return new NextResponse(JSON.stringify(response), { status });
  }
}

export const config = {
  matcher: "/api/((?!auth).*)",
};
