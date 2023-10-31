import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Cookies from "cookies";
import { config } from "@/lib/config/config";

const SignOut = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const cookies = new Cookies(ctx.req, ctx.res);

  const { error } = await supabase.auth.signOut();

  if (!error) {
    cookies.set(config.userDetailsCookieName, "", {
      maxAge: 0,
      overwrite: true,
    });

    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/?error=${error.message}`,
        permanent: false,
      },
    };
  }
};

export default SignOut;
