import { GetServerSideProps } from "next";
import Auth from "@/components/auth";
import { redirectToHomeOnSignedIn } from "@/lib/auth/methods";
import type { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../auth-layout";

const SignUp: NextPageWithLayout = () => {
  return <Auth type="register" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await redirectToHomeOnSignedIn(ctx);
};

SignUp.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default SignUp;
