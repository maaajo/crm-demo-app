import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { mainPages, routes } from "../routes";
import { GetServerSidePropsContext } from "next";
import { config } from "../config/config";
import { ParsedUrlQuery } from "querystring";

export type AuthCallbackQueryParams = ParsedUrlQuery & { returnURL?: string };

export const RedirectCheckType = {
  Auth: "auth",
  Main: "main",
} as const;

export type RedirectCheckKeys =
  (typeof RedirectCheckType)[keyof typeof RedirectCheckType];

const getRedirectUrlAfterSignIn = (
  returnURL: string | undefined,
  referer: string | undefined
) => {
  if (returnURL) {
    return returnURL;
  }

  if (referer && !referer.includes(mainPages.auth)) {
    return referer;
  }

  return routes.home;
};

export const checkPossibleRedirect = async (
  ctx: GetServerSidePropsContext,
  type: RedirectCheckKeys
) => {
  const supabaseClient = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (type === RedirectCheckType.Auth) {
    if (session) {
      const queryParams = ctx.query as AuthCallbackQueryParams;
      const returnURL = queryParams[
        config.authCallbackQueryParam as keyof AuthCallbackQueryParams
      ] as string | undefined;

      return {
        redirect: {
          destination: getRedirectUrlAfterSignIn(
            returnURL,
            ctx.req.headers.referer
          ),
          permanent: false,
        },
      };
    }
  }

  if (type === RedirectCheckType.Main) {
    if (!session) {
      const params = new URLSearchParams();
      params.append(config.authCallbackQueryParam, ctx.resolvedUrl);
      return {
        redirect: {
          destination: `${routes.auth.signIn}?${params.toString()}`,
          permanent: false,
        },
      };
    }
  }

  return null;
};
