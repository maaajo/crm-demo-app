import { NextPage, GetServerSideProps } from "next";
import Auth from "@/components/auth";
import { redirectToHomeOnSignedIn } from "@/lib/auth/methods";

const SignUp: NextPage = () => {
  return <Auth type="register" />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await redirectToHomeOnSignedIn(ctx);
};

export default SignUp;
