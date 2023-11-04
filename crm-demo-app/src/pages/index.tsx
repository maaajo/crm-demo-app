import { GetServerSideProps } from "next";
import {
  checkPossibleRedirect,
  getServerSideAuthUserDetails,
  RedirectCheckType,
} from "@/lib/auth/methods";
import Head from "next/head";
import { config } from "@/lib/config/config";
import PageTitle from "@/components/page-title";

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${config.appName} - Home`}</title>
      </Head>
      <PageTitle title="Home" />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  userEmail: string;
}> = async (ctx) => {
  const redirect = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirect) {
    return redirect;
  }

  const { userEmail } = await getServerSideAuthUserDetails(ctx);

  return {
    props: { userEmail },
  };
};
