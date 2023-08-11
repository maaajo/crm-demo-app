import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { checkPossibleRedirect, RedirectCheckType } from "@/lib/auth/methods";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function Home() {
  const { session, isLoading } = useSessionContext();

  console.log(session, isLoading);

  return <Box fontWeight={"extrabold"}>test</Box>;
}

//below needs check, somehow session is not available when this call is made

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  console.log(redirectPage);

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
