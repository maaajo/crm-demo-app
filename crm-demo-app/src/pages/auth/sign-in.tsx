import Auth from "@/components/auth";
import { verifyUser } from "@/lib/auth/lib";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";

const SignIn: NextPage = () => {
  return <Auth type="login" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await verifyUser(ctx);

  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignIn;
