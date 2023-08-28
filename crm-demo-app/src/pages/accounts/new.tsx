import PageTitle from "@/components/page-title";
import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { GetServerSideProps } from "next";

const AddNewAcount = () => {
  return <PageTitle title="Add new account" />;
};

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

export default AddNewAcount;
