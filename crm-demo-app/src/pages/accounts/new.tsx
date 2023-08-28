import PageTitle from "@/components/page-title";
import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, VStack } from "@chakra-ui/react";

const AddNewAcount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <>
      <PageTitle title="Add new account" />
    </>
  );
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
