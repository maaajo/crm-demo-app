import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { config } from "@/lib/config/config";
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

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const redirect = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirect) {
    return redirect;
  }

  return {
    props: {},
  };
};

export default AddNewAcount;
