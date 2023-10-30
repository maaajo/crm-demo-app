import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserDetails,
} from "@/lib/auth/methods";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { config } from "@/lib/config/config";
import { Database } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import AccountForm from "@/components/account/account-form";

const AddNewAcount = () => {
  return (
    <>
      <Head>
        <title>{`${config.appName} - New account`}</title>
      </Head>
      <AccountForm actionType="add" />
    </>
  );
};

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

export default AddNewAcount;
