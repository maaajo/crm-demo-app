import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { mainPages, routes } from "../routes";
import { Database } from "../types/supabase";
import Cookies from "cookies";
import { GetServerSidePropsContext } from "next";
import { Encrypter } from "./encrypter";
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

export const getServerSideAuthUserDetails = async (
  ctx: GetServerSidePropsContext
) => {
  // change to local storage

  const supabaseClient = createServerSupabaseClient<Database>(ctx);
  const { req, res } = ctx;
  const cookies = new Cookies(req, res);
  const returnObject = { userId: "", userEmail: "", avatarUri: "" };
  const encrypter = new Encrypter(process.env.HASH_KEY!);

  const audCookie = cookies.get(config.userDetailsCookieName);

  console.log(audCookie);

  if (audCookie) {
    const decryptedCookie = encrypter.decrypt(audCookie);
    const parsedAUDCookie = JSON.parse(decryptedCookie) as typeof returnObject;
    return {
      ...parsedAUDCookie,
      error: "",
    };
  }

  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error(error.message);
    return {
      ...returnObject,
      error: error.message,
    };
  }

  const { data: avatarData } = await supabaseClient
    .from("profile")
    .select("avatar_uri")
    .eq("id", data.user.id);

  returnObject.userEmail = data.user.email ?? "";
  returnObject.userId = data.user.id ?? "";

  // if (avatarData) {
  //   returnObject.avatarUri = avatarData[0].avatar_uri as string;
  // }

  cookies.set(
    config.userDetailsCookieName,
    encrypter.encrypt(JSON.stringify(returnObject)),
    {
      maxAge: 60 * 60 * 1000, // one hour,
      sameSite: "strict",
    }
  );

  return {
    ...returnObject,
    error: "",
  };
};
