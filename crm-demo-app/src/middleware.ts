import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TypedApiResponse } from "./lib/api/types";
import { verify } from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const { data, error } = await supabaseClient.auth.getSession();

  if (data.session?.user) {
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
        const token = authHeaderSplit[1];
        const secret = process.env.JWT_SECRET!;

        const decodedToken = verify(token, secret);

        return res;
      } catch (error: any) {
        const status = 400;
        const response: TypedApiResponse = {
          statusCode: status,
          errorMessage: "Invalid access token: " + error,
          result: "ERROR",
        };
        return Response.json(response, { status });
      }
    }
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
  matcher: "/api/((?!auth).*)",
};
