import { ReactNode, FormEvent } from "react";
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  ModalCloseButton,
  useToast,
  chakra,
} from "@chakra-ui/react";

type ModalBaseProps = {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  title: string;
  children: ReactNode;
};

const ModalBase = ({
  isOpen,
  onClose,
  isSubmitting,
  title,
  children,
}: ModalBaseProps) => {
  return (
    <Modal
      closeOnOverlayClick={!isSubmitting}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent py={8} px={4}>
        <ModalCloseButton isDisabled={isSubmitting} />
        <Heading
          fontSize={"2xl"}
          fontWeight={"extrabold"}
          textAlign={"center"}
          pt={8}
          pb={4}
        >
          {title}
        </Heading>
        <ModalBody textAlign={"center"} mb={4}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalBase;
