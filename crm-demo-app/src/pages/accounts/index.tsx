import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import {
  Text,
  VStack,
  Button,
  Flex,
  useToast,
  HStack,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { Users2, Plus, MoreVertical, UserPlus } from "lucide-react";
import { Icon } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";
import Head from "next/head";
import { config } from "@/lib/config/config";
import PageTitle from "@/components/page-title";
import { RowSelectionState } from "@tanstack/react-table";
import { TAccountSupabase } from "@/lib/types/account";
import { DataTable } from "@/components/data-table";
import {
  SupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import WarningConfirmationModal from "@/components/confirmation-modal/warning";
import { accountsTableColumns } from "@/components/account/account-table-columns";
import FakeDataModal from "@/components/account/fake-data-modal";
import useRouterRefresh from "@/lib/hooks/useRouterRefresh";

function AddNewAccountButton() {
  return (
    <Button
      type={"submit"}
      leftIcon={<Plus />}
      px={"5"}
      as={Link}
      href={routes.accounts.new}
      variant={"blackSolid"}
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

const deleteAccounts = async (
  accountsToDelete: string[],
  supabase: SupabaseClient<Database>
) => {
  const { error } = await supabase
    .from(config.tables.account)
    .delete()
    .in("id", accountsToDelete);

  return error;
};

const getAccountsIDsToDeleteFromSelection = (
  selectedAccountsIndexes: string[],
  accounts: TAccountSupabase[]
) => {
  return selectedAccountsIndexes.map((item) => accounts[Number(item)].id);
};

export default function AccountsHome({
  accounts,
  errorMessage,
}: AccountsHomeProps) {
  const toast = useToast();
  const [selectedAccounts, setSelectedAccounts] = useState<RowSelectionState>(
    {}
  );
  const selectedAccountsIndexes = Object.keys(selectedAccounts);
  const supabase = useSupabaseClient<Database>();
  const { refreshServerSideProps } = useRouterRefresh();
  const {
    isOpen: deleteWarningModalIsOpen,
    onOpen: deleteWarningModalOnOpen,
    onClose: deleteWarningModalOnClose,
  } = useDisclosure();

  const {
    isOpen: fakeAccountsModalIsOpen,
    onOpen: fakeAccountsModalOnOpen,
    onClose: fakeAccountsModalOnClose,
  } = useDisclosure();

  const handleDeleteSelected = async () => {
    const error = await deleteAccounts(
      getAccountsIDsToDeleteFromSelection(selectedAccountsIndexes, accounts),
      supabase
    );

    if (error) {
      toast({
        title: "Failed to delete accounts",
        description: error.message,
        status: "error",
      });

      deleteWarningModalOnClose();
      return;
    }

    toast({
      title: "Accounts deleted",
      description: "Selected account(s) deleted with success",
      status: "success",
    });

    refreshServerSideProps();
    setSelectedAccounts({});
    deleteWarningModalOnClose();
  };

  const handleFakeAccountsModalClose = () => {
    toast({
      title: "Accounts added",
      description: "Fake accounts added with success",
      status: "success",
    });
    refreshServerSideProps();
    setSelectedAccounts({});
    fakeAccountsModalOnClose();
  };

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Failed to read accounts",
        description: errorMessage,
        status: "error",
      });
    }
  }, [errorMessage, toast]);

  return (
    <>
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
            <HStack spacing={4}>
              <Button
                leftIcon={<Trash2 />}
                aria-label="button to delete accounts"
                colorScheme={"red"}
                variant={"outline"}
                onClick={deleteWarningModalOnOpen}
                isDisabled={selectedAccountsIndexes.length === 0}
              >
                Delete
              </Button>
              <AddNewAccountButton />
              <Menu isLazy={true}>
                <MenuButton
                  as={IconButton}
                  aria-label="Account options"
                  icon={<MoreVertical />}
                  variant={"blackWhiteOutline"}
                />
                <MenuList fontSize={"sm"}>
                  <MenuItem
                    py={2}
                    icon={
                      <Icon as={UserPlus} boxSize={{ base: 5, "2xl": 6 }} />
                    }
                    _hover={{ textDecoration: "none" }}
                    onClick={fakeAccountsModalOnOpen}
                  >
                    Generate fake data
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <DataTable
            data={accounts}
            columns={accountsTableColumns}
            isSelectable={true}
            rowSelectionState={selectedAccounts}
            onSelectChangeHandler={setSelectedAccounts}
            showPagination={true}
          />
        </>
      ) : (
        <EmptyState />
      )}
      <WarningConfirmationModal
        isOpen={deleteWarningModalIsOpen}
        onClose={deleteWarningModalOnClose}
        headingText="Confirm deletion"
        bodyText={`You're about to delete ${selectedAccountsIndexes.length} account(s) permanently. Please confirm.`}
        confirmButtonText="Delete"
        confirmButtonHandler={handleDeleteSelected}
      />
      <FakeDataModal
        isOpen={fakeAccountsModalIsOpen}
        onDefaultClose={fakeAccountsModalOnClose}
        onSuccessfulClose={handleFakeAccountsModalClose}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  accounts: TAccountSupabase[];
  errorMessage: string;
}> = async (ctx) => {
  const supabase = createServerSupabaseClient<Database>(ctx);
  const redirect = await checkPossibleRedirect(ctx, RedirectCheckType.Main);

  if (redirect) {
    return redirect;
  }

  // look what to do here in case fo error
  const { data, error } = await supabase
    .from(config.tables.account)
    .select(
      "id, created_at, country, address_line, city, currency, edited_at, is_active, name, revenue, source, state, status, website, zip"
    )
    .order("created_at", { ascending: true });

  let accounts = data ? data : [];
  let errorMessage = error ? error.message : "";

  return {
    props: { accounts, errorMessage },
  };
};
