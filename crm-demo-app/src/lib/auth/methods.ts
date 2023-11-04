import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { mainPages, routes } from "../routes";
import { Database } from "../types/supabase";
import Cookies from "cookies";
import { GetServerSidePropsContext } from "next";
import { Encrypter } from "./encrypter";
import { config } from "../config/config";
import { ParsedUrlQuery } from "querystring";
import { NextRequest, NextResponse } from "next/server";
import { IncomingMessage, ServerResponse } from "http";

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

type UserDetails = {
  fetchError?: string;
  userId: string;
  userEmail: string;
  avatarUri?: string;
};

const getAuthUserDetailsFromCookie = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const cookies = new Cookies(req, res);
  const audCookie = cookies.get(config.server.cookies.userDetailsName);
  const encrypter = new Encrypter(process.env.HASH_KEY!);

  if (audCookie) {
    const decryptedCookie = encrypter.decrypt(audCookie);
    const userDetails = JSON.parse(decryptedCookie) as UserDetails;

    return userDetails;
  }

  return undefined;
};

const getAvatarUriFromCookie = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const cookies = new Cookies(req, res);
  const avatarCookie = cookies.get(config.server.cookies.userAvatarName);

  if (avatarCookie) {
    return decodeURIComponent(avatarCookie);
  }

  return undefined;
};

const setUserDetailsCookie = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  userDetails: UserDetails
) => {
  const cookies = new Cookies(req, res);
};

export const getServerSideAuthUserDetails = async (
  ctx: GetServerSidePropsContext
): Promise<UserDetails> => {
  const supabaseClient = createServerSupabaseClient<Database>(ctx);
  const { req, res } = ctx;

  const cookies = new Cookies(req, res);
  const encrypter = new Encrypter(process.env.HASH_KEY!);

  const userDetailsFromCookie = getAuthUserDetailsFromCookie(req, res);

  if (userDetailsFromCookie) {
    return {
      ...userDetailsFromCookie,
      avatarUri: getAvatarUriFromCookie(req, res),
      fetchError: "",
    };
  }

  let userDetails: UserDetails = { userId: "", userEmail: "" };
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    return {
      ...userDetails,
      fetchError: error.message,
    };
  }

  userDetails.userEmail = data.user.email ?? "";
  userDetails.userId = data.user.id ?? "";

  cookies.set(
    config.server.cookies.userDetailsName,
    encrypter.encrypt(JSON.stringify(userDetails)),
    {
      maxAge: 60 * 60 * 1000, // one hour,
      sameSite: "strict",
    }
  );

  const { data: avatarData } = await supabaseClient
    .from("profile")
    .select("avatar_uri")
    .eq("id", data.user.id);

  const avatarUri = avatarData ? (avatarData[0].avatar_uri as string) : "";
  userDetails.avatarUri = avatarUri;

  cookies.set(
    config.server.cookies.userAvatarName,
    encodeURIComponent(avatarUri),
    {
      maxAge: 60 * 60 * 1000, // one hour,
      sameSite: "strict",
    }
  );

  return {
    ...userDetails,
  };
};
