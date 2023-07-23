import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";

const SignOut = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const { error } = await supabase.auth.signOut();

  if (!error) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  } else {
    console.log(error);
  }

  return {
    props: {},
  };
};

export default SignOut;
