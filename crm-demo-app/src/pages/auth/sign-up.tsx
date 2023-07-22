import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage, GetServerSideProps } from "next";
import Auth from "@/components/auth";
import { verifyUser } from "@/lib/auth/lib";

const SignUp: NextPage = () => {
  return <Auth type="register" />;
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

export default SignUp;
