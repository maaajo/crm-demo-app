import Auth from "@/components/auth";
import { redirectToHomeOnSignedIn } from "@/lib/auth/methods";
import { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import AuthLayout from "../auth-layout";

const SignIn: NextPageWithLayout = () => {
  return <Auth type="login" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await redirectToHomeOnSignedIn(ctx);
};

SignIn.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignIn;
