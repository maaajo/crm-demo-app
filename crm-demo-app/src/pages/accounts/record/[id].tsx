import AccountForm from "@/components/account/account-form";
import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import { config } from "@/lib/config/config";
import { TAccountSupabase } from "@/lib/types/account";
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
        <title>{`${config.appName} - View account`}</title>
      </Head>
      {account ? (
        <AccountForm actionType="view" account={account} />
      ) : (
        <div>Account not found</div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const query = ctx.query as QueryParams;

  const redirect = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirect) {
    return redirect;
  }

  const account: TAccountSupabase = query;

  return {
    props: { account },
  };
};
