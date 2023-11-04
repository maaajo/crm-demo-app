import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Cookies from "cookies";
import { config } from "@/lib/config/config";
import { routes } from "@/lib/routes";

const SignOut = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const cookies = new Cookies(ctx.req, ctx.res);

  const { error } = await supabase.auth.signOut();

  if (!error) {
    cookies.set(config.server.cookies.userDetailsName, "", {
      maxAge: 0,
      overwrite: true,
    });

    cookies.set(config.server.cookies.userAvatarName, "", {
      maxAge: 0,
      overwrite: true,
    });

    return {
      redirect: {
        destination: routes.auth.signOut,
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
