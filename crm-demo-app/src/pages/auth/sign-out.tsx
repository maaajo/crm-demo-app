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

  const { error } = await supabase.auth.signOut();

  if (!error) {
    return {
      redirect: {
        destination: routes.auth.signIn,
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
