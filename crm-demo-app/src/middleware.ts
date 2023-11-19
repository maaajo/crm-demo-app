import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TypedApiResponse } from "./lib/api/types";
import { verifyTokenAuth } from "./lib/api/utils/auth";
import { verifySupabaseAuth } from "./lib/api/utils/auth";
import getBearerTokenFromHeader from "./lib/api/utils";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  let isMissingAuth = false;

  const isSupabaseAuth = await verifySupabaseAuth(req, res);

  if (isSupabaseAuth) {
    return res;
  }

  const authHeader = req.headers.get("Authorization");

  if (authHeader) {
    const bearerToken = getBearerTokenFromHeader(authHeader);

    if (bearerToken) {
      try {
        await verifyTokenAuth(bearerToken);

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
