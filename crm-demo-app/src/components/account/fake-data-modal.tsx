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
} from "@chakra-ui/react";
import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { FormEvent } from "react";

type FakeDataModal = {
  isOpen: boolean;
  onClose: () => void;
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

const FakeDataModal = ({ isOpen, onClose }: FakeDataModal) => {
  const supabase = useSupabaseClient<Database>();

  const handleGenerateFakeAccounts = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const numberOfAccountsToGenerate = formData.get(selectFormName);
  };

  return (
    <Modal
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent py={8} px={4}>
        <ModalCloseButton />
        <ModalBody textAlign={"center"} mt={20} mb={4}>
          <chakra.form onSubmit={handleGenerateFakeAccounts}>
            <Heading fontSize={"2xl"} fontWeight={"extrabold"}>
              Generate fake accounts
            </Heading>
            <FormControl mt={6}>
              <FormLabel textAlign={"center"}>
                Number of fake accounts to generate:
              </FormLabel>
              <Select
                borderColor={"blackAlpha.500"}
                backgroundColor={"white"}
                _focusVisible={{
                  borderColor: "blackAlpha.900",
                }}
                _hover={{ borderColor: "blackAlpha.500" }}
                name={selectFormName}
                mt={4}
              >
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
                variant={"outline"}
                colorScheme={"blackAlpha"}
                color={"blackAlpha.900"}
                type={"submit"}
              >
                Generate
              </Button>
              <Button
                flex={1}
                name="cancel"
                variant={"blackSolid"}
                onClick={onClose}
                type={"button"}
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
