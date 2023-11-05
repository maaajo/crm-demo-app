import { GetServerSideProps } from "next";
import { checkPossibleRedirect, RedirectCheckType } from "@/lib/auth/methods";
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

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const redirect = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirect) {
    return redirect;
  }

  return {
    props: {},
  };
};
