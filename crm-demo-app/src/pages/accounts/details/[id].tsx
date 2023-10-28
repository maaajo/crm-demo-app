import AccountForm from "@/components/account/account-form";
import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserDetails,
} from "@/lib/auth/methods";
import { config } from "@/lib/config/config";
import { TAccountSupabase } from "@/lib/types/account";
import { Database } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

type PageProps = {
  account: TAccountSupabase | null;
};

type QueryParams = ParsedUrlQuery & TAccountSupabase;

export default function AccountView({ account }: PageProps) {
  return (
    <>
      <Head>
        <title>{`${config.appName} - view account`}</title>
      </Head>
      {account ? (
        <AccountForm actionType="view" account={account} />
      ) : (
        <div>Account not found</div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  PageProps & { userEmail: string }
> = async (ctx) => {
  const query = ctx.query as QueryParams;

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

  const account: TAccountSupabase = query;

  return {
    props: { userEmail, account },
  };
};
