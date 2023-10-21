import AccountForm from "@/components/account-form";
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
  userId: string;
};

type QueryParams = ParsedUrlQuery & TAccountSupabase;

export default function AccountEdit({ account, userId }: PageProps) {
  return (
    <>
      <Head>
        <title>{`${config.appName} - Edit account`}</title>
      </Head>
      {account ? (
        <AccountForm actionType="edit" userId={userId} account={account} />
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

  const { userEmail, userId } = await getServerSideAuthUserDetails(supabase);

  const account: TAccountSupabase = query;

  return {
    props: { userEmail, account, userId },
  };
};
