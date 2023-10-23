import {
  Button,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Icon,
} from "@chakra-ui/react";
import { CheckCircle2 } from "lucide-react";

const constNotificationType = {
  SUCCESS: "success",
  WARNING: "warning",
  FAILURE: "failure",
  INFO: "info",
} as const;

type NotificationType =
  (typeof constNotificationType)[keyof typeof constNotificationType];

type NotificationModalProps = {
  type: NotificationType;
  isOpen: boolean;
  onClose: () => void;
  headingText: string;
  bodyText: string;
  buttonHref: string;
  buttonText: string;
};

// maybe needs type like success, warning, failure?

const NotificationModal = ({
  type,
  isOpen,
  onClose,
  headingText,
  bodyText,
  buttonHref,
  buttonText,
}: NotificationModalProps) => {
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent py={8} px={4}>
        <ModalBody textAlign={"center"} mt={20} mb={6}>
          <Icon as={CheckCircle2} boxSize={14} color={"green.500"} mb={6} />
          <Heading size={"md"} as={"h5"}>
            {headingText}
          </Heading>
          <Text mt={"5"} color={"blackAlpha.700"}>
            {bodyText}
          </Text>
        </ModalBody>

        <ModalFooter display={"flex"} justifyContent={"center"} width={"full"}>
          <Button
            as={Link}
            href={buttonHref}
            width={"full"}
            variant={"solid"}
            color={"white"}
            _hover={{
              bgColor: "blackAlpha.800",
              textDecoration: "none",
            }}
            bgColor={"black"}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NotificationModal;
