import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { checkPossibleRedirect, RedirectCheckType } from "@/lib/auth/methods";

export default function Home() {
  return <Box fontWeight={"extrabold"}>test</Box>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

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
