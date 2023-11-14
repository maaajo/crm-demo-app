import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function verifyTokenAuth(token: string) {
  if (!token || token.length === 0) {
    throw new Error("Missing auth token");
  }

  try {
    const jwtSecret = getJwtSecretKey();
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwtSecret)
    );
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function verifySupabaseAuth(req: NextRequest, res: NextResponse) {
  const supabaseClient = createMiddlewareSupabaseClient({ req, res });

  const { data } = await supabaseClient.auth.getSession();

  if (data) {
    if (data.session) {
      return true;
    }
  }

  return false;
}

function getJwtSecretKey() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET || JWT_SECRET.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set");
  }

  return JWT_SECRET;
}
