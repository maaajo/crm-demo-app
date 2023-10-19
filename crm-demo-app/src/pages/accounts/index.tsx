import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserDetails,
} from "@/lib/auth/methods";
import {
  Text,
  VStack,
  Button,
  Flex,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { Users2, Plus } from "lucide-react";
import { Icon, IconButton } from "@chakra-ui/react";
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
import { useEffect } from "react";
import dayjs from "dayjs";

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
  columnHelper.accessor("id", {
    cell: (value) => <Checkbox key={value.getValue()} />,
    header: "",
    enableSorting: false,
    id: "checkbox",
  }),
  columnHelper.accessor("name", {
    cell: (value) => value.getValue(),
    header: "Name",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("is_active", {
    cell: (value) => startCase(String(value.getValue())),
    header: "Active",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("status", {
    cell: (value) => startCase(value.getValue()),
    header: "Status",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("source", {
    cell: (value) => value.getValue(),
    header: "Source",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("currency", {
    cell: (value) => value.getValue(),
    header: "Currency",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("country", {
    cell: (value) => {
      const countryData = Countries.filter(
        (country) => country.code === value.getValue()
      )[0];
      return `${countryData.flag} ${countryData.name}`;
    },
    header: "Country",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("city", {
    cell: (value) => startCase(value.getValue()),
    header: "City",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("created_at", {
    cell: (value) => dayjs(value.getValue()).format("DD/MM/YYYY HH:mm"),
    header: "Created at",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("id", {
    cell: (value) => (
      <IconButton
        aria-label="Edit current account"
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
  errorMessage: string;
};

export default function AccountsHome({
  accounts,
  errorMessage,
}: AccountsHomeProps) {
  const toast = useToast();

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Failed to read accounts",
        description: errorMessage,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 10000,
      });
    }
  }, [errorMessage, toast]);

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
  errorMessage: string;
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

  const { userEmail } = await getServerSideAuthUserDetails(supabase);

  // look what to do here in case fo error
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  let accounts = data ? data : [];
  let errorMessage = error ? error.message : "";

  return {
    props: { userEmail, accounts, errorMessage },
  };
};
