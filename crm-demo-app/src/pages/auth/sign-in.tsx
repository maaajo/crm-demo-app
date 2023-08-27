import Auth from "@/components/auth";
import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import AuthLayout from "../../components/auth-layout";
import Head from "next/head";
import { config } from "@/lib/config/config";

const SignIn: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`${config.appName} - Sign In`}</title>
      </Head>
      <Auth type="login" />;
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Auth);

  console.log(redirectPage);

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
