import { Database } from "@/lib/types/supabase";
import { generateFakeAccount } from "@/lib/utils";
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  ModalCloseButton,
  Select,
  chakra,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { FormEvent, useState } from "react";

type FakeDataModal = {
  isOpen: boolean;
  onSuccessfulClose: () => void;
  onDefaultClose: () => void;
};

const selectFormName = "accounts_number";

const insertFakeAccounts = async (
  supabase: SupabaseClient<Database>,
  numberOfAccounts: number
) => {
  const fakeAccounts = [...Array(numberOfAccounts).keys()].map((item) =>
    generateFakeAccount()
  );

  const { error } = await supabase.from("accounts").insert(fakeAccounts);

  return error;
};

const FakeDataModal = ({
  isOpen,
  onDefaultClose,
  onSuccessfulClose,
}: FakeDataModal) => {
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
    <Modal
      closeOnOverlayClick={!isSubmitting}
      isOpen={isOpen}
      onClose={onDefaultClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent py={8} px={4}>
        <ModalCloseButton isDisabled={isSubmitting} />
        <ModalBody textAlign={"center"} mt={20} mb={4}>
          <chakra.form onSubmit={handleGenerateFakeAccounts}>
            <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
              Generate fake accounts
            </Heading>
            <FormControl mt={6} isDisabled={isSubmitting}>
              <FormLabel textAlign={"center"}>
                Number of fake accounts to generate:
              </FormLabel>
              <Select variant={"primary"} name={selectFormName} mt={4}>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormControl>
            <HStack pt={8} width={"full"}>
              <Button
                flex={1}
                name="confirm"
                variant={"blackWhiteOutline"}
                type={"submit"}
                isLoading={isSubmitting}
                loadingText="Generating..."
              >
                Generate
              </Button>
              <Button
                flex={1}
                name="cancel"
                variant={"blackSolid"}
                onClick={onDefaultClose}
                type={"button"}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </HStack>
          </chakra.form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FakeDataModal;
