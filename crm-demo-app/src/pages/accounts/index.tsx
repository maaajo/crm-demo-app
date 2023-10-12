import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { Text, VStack, Button, Flex } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { Users2, Plus } from "lucide-react";
import { Icon } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";
import Head from "next/head";
import { config } from "@/lib/config/config";
import PageTitle from "@/components/page-title";
import { useAccounts } from "@/lib/context/account";
import { createColumnHelper } from "@tanstack/react-table";
import { TAccount } from "@/lib/types/account";
import { DataTable } from "@/components/data-table";

function AddNewAccountButton() {
  return (
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
  );
}

function EmptyState() {
  return (
    <>
      <PageTitle title="Accounts" />
      <VStack py={"10"} spacing={5}>
        <Icon as={Users2} boxSize={"12"} color={"black"} />
        <Text fontSize={"xl"} fontWeight={"bold"} letterSpacing={"tight"}>
          No accounts yet
        </Text>
        <Text fontSize={"md"} color={"blackAlpha.800"}>
          Add new account to easily track your sales opportunities
        </Text>
        <AddNewAccountButton />
      </VStack>
    </>
  );
}

const columnHelper = createColumnHelper<TAccount>();

const columns = [
  columnHelper.accessor("accountName", {
    cell: (info) => info.getValue(),
    header: "Name",
  }),
  columnHelper.accessor("isActive", {
    cell: (info) => info.getValue(),
    header: "Active",
  }),
  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: "Status",
  }),
  columnHelper.accessor("source", {
    cell: (info) => info.getValue(),
    header: "Source",
  }),
  columnHelper.accessor("currency", {
    cell: (info) => info.getValue(),
    header: "Currency",
  }),
  columnHelper.accessor("country", {
    cell: (info) => info.getValue(),
    header: "Country",
  }),
  columnHelper.accessor("city", {
    cell: (info) => info.getValue(),
    header: "City",
  }),
];

export default function AccountsHome() {
  const { state: accounts } = useAccounts();

  // table: https://chakra-ui.com/getting-started/with-react-table

  return (
    <div>
      <Head>
        <title>{`${config.appName} - Accounts`}</title>
      </Head>
      {accounts.length ? (
        <>
          <Flex
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <PageTitle title="Accounts" />
            <AddNewAccountButton />
          </Flex>
          <DataTable data={accounts} columns={columns} />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
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
