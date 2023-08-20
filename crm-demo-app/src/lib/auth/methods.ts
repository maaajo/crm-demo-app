import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { routes } from "../routes";

export const RedirectCheckType = {
  Auth: "auth",
  Main: "main",
} as const;

export type RedirectCheckKeys =
  (typeof RedirectCheckType)[keyof typeof RedirectCheckType];

export const checkPossibleRedirect = async (
  ctx: GetServerSidePropsContext,
  type: RedirectCheckKeys
) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (type === RedirectCheckType.Auth) {
    if (session) {
      return "/";
    }
  }

  if (type === RedirectCheckType.Main) {
    if (!session) {
      return routes.auth.signIn;
    }
  }

  return "";
};

export const getServerSideAuthUserEmail = async (
  ctx: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error.message);
    return "";
  }

  let userEmail = "";

  if (data.user) {
    userEmail = data.user.email ?? "";
  }

  return userEmail;
};
