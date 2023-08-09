import { GetServerSideProps } from "next";
import Auth from "@/components/auth";
import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import type { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../auth-layout";

const SignUp: NextPageWithLayout = () => {
  return <Auth type="register" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Auth);

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

SignUp.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignUp;
