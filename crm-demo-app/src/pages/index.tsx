import { GetServerSideProps } from "next";
import {
  checkPossibleRedirect,
  getServerSideAuthUserDetails,
  RedirectCheckType,
} from "@/lib/auth/methods";
import Head from "next/head";
import { config } from "@/lib/config/config";
import PageTitle from "@/components/page-title";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";

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
  const supabase = createServerSupabaseClient<Database>(ctx);

  const redirectPage = await checkPossibleRedirect(
    supabase,
    RedirectCheckType.Main
  );

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  const { userEmail } = await getServerSideAuthUserDetails(supabase);

  return {
    props: { userEmail },
  };
};
