import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import {
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
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
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  const userEmail = await getServerSideAuthUserEmail(ctx);

  return {
    props: { userEmail },
  };
};
