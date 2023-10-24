import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Icon,
  HStack,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

type WarningConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  headingText: string;
  bodyText: string;
  confirmButtonText: string;
  confirmButtonHandler: () => {};
};

// maybe needs type like success, warning, failure?

const WarningConfirmationModal = ({
  isOpen,
  onClose,
  headingText,
  bodyText,
  confirmButtonText,
  confirmButtonHandler,
}: WarningConfirmationModalProps) => {
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
          <Icon as={AlertTriangle} boxSize={14} color={"orange.400"} mb={6} />
          <Heading size={"md"} as={"h5"}>
            {headingText}
          </Heading>
          <Text mt={"5"} color={"blackAlpha.700"}>
            {bodyText}
          </Text>
        </ModalBody>
        <ModalFooter display={"flex"} justifyContent={"center"} width={"full"}>
          <HStack width={"full"}>
            <Button
              flex={1}
              name="confirm"
              onClick={confirmButtonHandler}
              colorScheme={"orange"}
            >
              {confirmButtonText}
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
