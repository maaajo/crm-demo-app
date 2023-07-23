import Auth from "@/components/auth";
import { redirectToHomeOnSignedIn } from "@/lib/auth/methods";
import { GetServerSideProps, NextPage } from "next";

const SignIn: NextPage = () => {
  return <Auth type="login" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await redirectToHomeOnSignedIn(ctx);
};

export default SignIn;
