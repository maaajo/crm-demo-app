import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { Box, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useState } from "react";

export default function AccountsHome() {
  const [accounts, setAccounts] = useState(() => []);

  return (
    <Box
      w={"full"}
      py={"10"}
      px={"4"}
      backgroundColor={"whiteAlpha.600"}
      borderRadius={"lg"}
      boxShadow={"sm"}
      borderWidth={"thin"}
      borderColor={"blackAlpha.300"}
    >
      <Text>Test</Text>
    </Box>
  );
}

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
