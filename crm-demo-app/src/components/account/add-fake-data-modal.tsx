import { config } from "@/lib/config/config";
import { Database } from "@/lib/types/supabase";
import { generateFakeAccounts } from "@/lib/utils";
import { useToast } from "@chakra-ui/react";
import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { FormEvent, useState } from "react";
import ModalSimpleSelect from "../modal-simple-select";

type AddFakeDataModalProps = {
  isOpen: boolean;
  onSuccessfulClose: () => void;
  onDefaultClose: () => void;
};

const selectFormName = "accounts_number";

const insertFakeAccounts = async (
  supabase: SupabaseClient<Database>,
  numberOfAccounts: number
) => {
  const fakeAccounts = generateFakeAccounts(numberOfAccounts);

  const { error } = await supabase
    .from(config.tables.account)
    .insert(fakeAccounts);

  return error;
};

const AddFakeDataModal = ({
  isOpen,
  onDefaultClose,
  onSuccessfulClose,
}: AddFakeDataModalProps) => {
  const supabase = useSupabaseClient<Database>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleGenerateFakeAccounts = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const numberOfAccountsToGenerate = formData
        .get(selectFormName)!
        .toString();
      const postgresError = await insertFakeAccounts(
        supabase,
        parseInt(numberOfAccountsToGenerate)
      );

      if (postgresError) {
        toast({
          status: "error",
          description: postgresError.message,
          title: "Failure",
        });
        onDefaultClose();
        return;
      }

      onSuccessfulClose();
    } catch (e: any) {
      toast({
        status: "error",
        description: e.message,
        title: "Failure",
      });
      onDefaultClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalSimpleSelect
      isOpen={isOpen}
      isSubmitting={isSubmitting}
      onClose={onDefaultClose}
      title="Add fake accounts"
      onSubmit={handleGenerateFakeAccounts}
      selectFormLabelText="Select number of accounts to add:"
      selectName={selectFormName}
      selectOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
    />
  );
};

export default AddFakeDataModal;
