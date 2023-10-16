import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { Text, VStack, Button, Flex } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { Users2, Plus } from "lucide-react";
import { Icon, IconButton, useToast } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";
import Head from "next/head";
import { config } from "@/lib/config/config";
import PageTitle from "@/components/page-title";
import { createColumnHelper } from "@tanstack/react-table";
import { TAccountSupabase } from "@/lib/types/account";
import { DataTable } from "@/components/data-table";
import { Countries } from "@/lib/static/countries";
import startCase from "lodash.startcase";
import { Pencil } from "lucide-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";
import { PostgrestError } from "@supabase/supabase-js";

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

const columnHelper = createColumnHelper<TAccountSupabase>();

const columns = [
  columnHelper.accessor("name", {
    cell: (value) => startCase(value.getValue()),
    header: "Name",
  }),
  columnHelper.accessor("is_active", {
    cell: (value) => startCase(String(value.getValue())),
    header: "Active",
  }),
  columnHelper.accessor("status", {
    cell: (value) => startCase(value.getValue()),
    header: "Status",
  }),
  columnHelper.accessor("source", {
    cell: (value) => value.getValue(),
    header: "Source",
  }),
  columnHelper.accessor("currency", {
    cell: (value) => value.getValue(),
    header: "Currency",
  }),
  columnHelper.accessor("country", {
    cell: (value) => {
      const countryData = Countries.filter(
        (country) => country.code === value.getValue()
      )[0];
      return `${countryData.flag} ${countryData.name}`;
    },
    header: "Country",
  }),
  columnHelper.accessor("city", {
    cell: (value) => startCase(value.getValue()),
    header: "City",
  }),
  columnHelper.accessor("id", {
    cell: (value) => (
      <IconButton
        aria-label="More actions for each row in accounts table"
        as={Link}
        href={`${routes.accounts.edit}/${value.getValue()}`}
        icon={<Pencil />}
        variant={"unstyled"}
        size={"sm"}
      />
    ),
    enableSorting: false,
    header: "",
  }),
];

type AccountsHomeProps = {
  accounts: TAccountSupabase[];
  error: PostgrestError | null;
};

export default function AccountsHome({ accounts, error }: AccountsHomeProps) {
  const toast = useToast();

  if (error) {
    toast({
      title: `Failed to get accounts`,
      description: `${error.message}`,
      status: "error",
      isClosable: true,
      position: "top",
      duration: 10000,
    });
  }

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
  accounts: TAccountSupabase[];
  error: PostgrestError | null;
}> = async (ctx) => {
  const supabase = createServerSupabaseClient<Database>(ctx);
  const redirectPage = await checkPossibleRedirect(
    supabase,
    RedirectCheckType.Main
  );

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  const userEmail = await getServerSideAuthUserEmail(supabase);

  // look what to do here in case fo error
  const { data, error } = await supabase.from("accounts").select("*");

  let accounts: TAccountSupabase[];

  if (!data) {
    accounts = [];
  } else {
    accounts = data;
  }

  return {
    props: { userEmail, accounts, error },
  };
};
