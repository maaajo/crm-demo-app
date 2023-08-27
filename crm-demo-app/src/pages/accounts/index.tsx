import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { Text, VStack, Button } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Users2, Plus } from "lucide-react";
import { Icon } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";
import Head from "next/head";
import { config } from "@/lib/config/config";

function EmptyState() {
  return (
    <VStack py={"10"} spacing={5}>
      <Icon as={Users2} boxSize={"12"} color={"black"} />
      <Text fontSize={"xl"} fontWeight={"bold"} letterSpacing={"tight"}>
        No accounts yet
      </Text>
      <Text fontSize={"md"} color={"blackAlpha.800"}>
        Add new account to easily track your sales opportunities
      </Text>
      <Button
        variant={"solid"}
        type={"submit"}
        bgColor={"black"}
        color={"white"}
        _hover={{
          bgColor: "blackAlpha.800",
          textDecoration: "none",
        }}
        leftIcon={<Plus />}
        px={"5"}
        as={Link}
        href={routes.accounts.new}
      >
        Add new account
      </Button>
    </VStack>
  );
}

export default function AccountsHome() {
  const [accounts, setAccounts] = useState(() => []);

  return (
    <>
      <Head>
        <title>{`${config.appName} - Accounts`}</title>
      </Head>
      {accounts.length ? null : <EmptyState />}
    </>
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
    props: { userEmail, pageTitle: "Accounts" },
  };
};
