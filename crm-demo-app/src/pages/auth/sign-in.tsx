import Auth from "@/components/auth";
import { redirectToHomeOnSignedIn } from "@/lib/auth/methods";
import { GetServerSideProps, NextPage } from "next";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";

const SignIn: NextPageWithLayout = () => {
  return <Auth type="login" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await redirectToHomeOnSignedIn(ctx);
};

SignIn.getLayout = (page: ReactElement) => page;

export default SignIn;
