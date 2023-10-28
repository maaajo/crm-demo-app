import { Database } from "@/lib/types/supabase";
import { generateFakeAccount } from "@/lib/utils";
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  HStack,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { MouseEventHandler } from "react";

type FakeDataModal = {
  isOpen: boolean;
  onClose: () => void;
};

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

const WarningConfirmationModal = ({ isOpen, onClose }: FakeDataModal) => {
  const supabase = useSupabaseClient<Database>();

  const handleGenerateFakeAccounts = (
    event: MouseEventHandler<HTMLButtonElement, MouseEvent>
  ) => {};

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
        <ModalBody textAlign={"center"} mt={20} mb={6}>
          <Heading size={"md"} as={"h5"}>
            Generate fake accounts
          </Heading>
          <Text mt={"5"} color={"blackAlpha.700"}>
            Select number of fake accounts to generate
          </Text>
          <Select
            borderColor={"blackAlpha.500"}
            backgroundColor={"white"}
            _focusVisible={{
              borderColor: "blackAlpha.900",
            }}
            _hover={{ borderColor: "blackAlpha.500" }}
            name="accounts_number"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter display={"flex"} justifyContent={"center"} width={"full"}>
          <HStack width={"full"}>
            <Button
              flex={1}
              name="confirm"
              onClick={handleGenerateFakeAccounts}
              variant={"outline"}
              colorScheme={"blackAlpha"}
              color={"blackAlpha.900"}
            >
              Generate
            </Button>
            <Button
              flex={1}
              name="cancel"
              variant={"blackSolid"}
              onClick={onClose}
            >
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WarningConfirmationModal;
