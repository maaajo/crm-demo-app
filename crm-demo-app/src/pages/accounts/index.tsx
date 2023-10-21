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
import {
  Row,
  RowSelectionState,
  createColumnHelper,
  Cell,
  CellContext,
} from "@tanstack/react-table";
import { TAccountSupabase } from "@/lib/types/account";
import { DataTable } from "@/components/data-table";
import { Countries } from "@/lib/static/countries";
import startCase from "lodash.startcase";
import { Pencil } from "lucide-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<TAccountSupabase>();

const columns = [
  columnHelper.accessor("id", {
    cell: ({ cell, row }) => {
      return (
        <Checkbox
          key={cell.getValue()}
          colorScheme="blackAlpha"
          isChecked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          borderColor={"blackAlpha.100"}
        />
      );
    },
    header: "",
    enableSorting: false,
    id: "checkbox",
  }),
  columnHelper.accessor("name", {
    cell: ({ cell }) => {
      return cell.getValue();
    },
    header: "Name",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("is_active", {
    cell: ({ cell }) => startCase(String(cell.getValue())),
    header: "Active",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("status", {
    cell: ({ cell }) => startCase(cell.getValue()),
    header: "Status",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("source", {
    cell: ({ cell }) => cell.getValue(),
    header: "Source",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("currency", {
    cell: ({ cell }) => cell.getValue(),
    header: "Currency",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("country", {
    cell: ({ cell }) => {
      const countryData = Countries.filter(
        (country) => country.code === cell.getValue()
      )[0];
      return `${countryData.flag} ${countryData.name}`;
    },
    header: "Country",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("city", {
    cell: ({ cell }) => startCase(cell.getValue()),
    header: "City",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("created_at", {
    cell: ({ cell }) => dayjs(cell.getValue()).format("DD/MM/YYYY HH:mm"),
    header: "Created at",
    sortingFn: "datetime",
  }),
  {
    cell: ({ row }: CellContext<TAccountSupabase, unknown>) => {
      const editURLSearchParamas = new URLSearchParams();

      const dataKeysFiltered = Object.keys(row.original).filter(
        (item) => item !== "id"
      );

      for (let objectKey of dataKeysFiltered) {
        const currentValue =
          row.original[objectKey as keyof typeof row.original];
        if (currentValue) {
          editURLSearchParamas.append(objectKey, currentValue.toString());
        } else {
          editURLSearchParamas.append(objectKey, "");
        }
      }

      return (
        <IconButton
          aria-label="Edit current account"
          as={Link}
          href={`${routes.accounts.edit}/${row.original.id}?${editURLSearchParamas}`}
          icon={<Pencil />}
          variant={"unstyled"}
          size={"sm"}
        />
      );
    },
    enableSorting: false,
    header: "",
    id: "edit",
  },
];

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

type AccountsHomeProps = {
  accounts: TAccountSupabase[];
  errorMessage: string;
};

export default function AccountsHome({
  accounts,
  errorMessage,
}: AccountsHomeProps) {
  const toast = useToast();
  const [selectedAccounts, setSelectedAccounts] = useState<RowSelectionState>(
    {}
  );
  console.log(Object.keys(selectedAccounts));

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
          <DataTable
            data={accounts}
            columns={columns}
            isSelectable={true}
            rowSelectionState={selectedAccounts}
            onSelectChangeHandler={setSelectedAccounts}
          />
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
    .select(
      "id, created_at, country, address_line, city, currency, edited_at, is_active, name, revenue, source, state, status, website, zip"
    )
    .order("created_at", { ascending: true });

  let accounts = data ? data : [];
  let errorMessage = error ? error.message : "";

  return {
    props: { userEmail, accounts, errorMessage },
  };
};
