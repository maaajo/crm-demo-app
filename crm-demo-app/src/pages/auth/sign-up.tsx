import { GetServerSideProps } from "next";
import Auth from "@/components/auth";
import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import type { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../../components/auth-layout";
import Head from "next/head";
import { config } from "@/lib/config/config";

const SignUp: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`${config.appName} - Sign Up`}</title>
      </Head>
      <Auth type="register" />;
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirect = await checkPossibleRedirect(ctx, RedirectCheckType.Auth);

  if (redirect) {
    return redirect;
  }

  return {
    props: {},
  };
};

SignUp.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignUp;
