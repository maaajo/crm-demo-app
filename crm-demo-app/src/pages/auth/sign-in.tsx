import Auth from "@/components/auth";
import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import AuthLayout from "../auth-layout";

const SignIn: NextPageWithLayout = () => {
  return <Auth type="login" />;
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

SignIn.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignIn;
