import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { routes } from "../routes";
import { Database } from "../types/supabase";

export const RedirectCheckType = {
  Auth: "auth",
  Main: "main",
} as const;

export type RedirectCheckKeys =
  (typeof RedirectCheckType)[keyof typeof RedirectCheckType];

export const checkPossibleRedirect = async (
  supabaseClient: SupabaseClient<Database>,
  type: RedirectCheckKeys
) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

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
  supabaseClient: SupabaseClient<Database>
) => {
  const { data, error } = await supabaseClient.auth.getUser();

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
