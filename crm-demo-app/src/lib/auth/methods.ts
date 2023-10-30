import {
  SupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { routes } from "../routes";
import { Database } from "../types/supabase";
import Cookies from "cookies";
import { GetServerSidePropsContext } from "next";
import { Encrypter } from "./encrypter";

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
  const supabaseClient = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (type === RedirectCheckType.Auth) {
    if (session) {
      return {
        redirect: {
          destination: ctx.req.headers.referer ? ctx.req.headers.referer : "/",
          permanent: false,
        },
      };
    }
  }

  if (type === RedirectCheckType.Main) {
    if (!session) {
      const params = new URLSearchParams();
      params.append("cb", ctx.resolvedUrl);
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
  const supabaseClient = createServerSupabaseClient<Database>(ctx);
  const { req, res } = ctx;
  const cookieName = "aud_Secure";
  const cookies = new Cookies(req, res);
  const returnObject = { userId: "", userEmail: "" };
  const encrypter = new Encrypter(process.env.HASH_KEY!);

  const audCookie = cookies.get(cookieName);

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
      userEmail: "",
      userId: "",
      error: error.message,
    };
  }

  returnObject.userEmail = data.user.email ?? "";
  returnObject.userId = data.user.id ?? "";

  cookies.set(cookieName, encrypter.encrypt(JSON.stringify(returnObject)), {
    maxAge: 60 * 60 * 1000, // one hour,
    sameSite: "strict",
  });

  return {
    ...returnObject,
    error: "",
  };
};
