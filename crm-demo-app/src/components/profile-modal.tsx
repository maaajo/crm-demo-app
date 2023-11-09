import { useUserProfileContext } from "@/lib/context/user-profile";
import { routes } from "@/lib/routes";
import { Link } from "@chakra-ui/next-js";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Icon,
  ModalFooter,
  Button,
  Box,
  Image,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userProfile } = useUserProfileContext();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(15px) hue-rotate(90deg)"
      />
      <ModalContent py={6}>
        <ModalBody
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <Image
            alt="user avatar"
            maxH={"180px"}
            objectFit={"cover"}
            mt={-24}
            src={userProfile.avatar_uri ?? ""}
            borderRadius={"lg"}
            boxShadow={"lg"}
            transition={"transform ease .3s"}
            _hover={{
              transform: "scale(1.04)",
            }}
          />
          <VStack my={6}>
            <Text fontSize={"xl"} fontWeight={"bold"} letterSpacing={"tight"}>
              {userProfile.email}
            </Text>
            <Box py={4}>
              <VStack spacing={2}>
                <HStack fontSize={"sm"}>
                  <Text fontWeight={"semibold"}>Registered at:</Text>
                  <Text>
                    {dayjs(userProfile.created_at).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </HStack>
                <HStack fontSize={"sm"}>
                  <Text fontWeight={"semibold"}>Last sign in at:</Text>
                  <Text>
                    {dayjs(userProfile.last_sign_in_at).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter display={"flex"} justifyContent={"center"} width={"full"}>
          <Button
            as={Link}
            href={routes.auth.signOut}
            color={"whiteAlpha.900"}
            w={"full"}
            variant={"blackSolid"}
          >
            Sign out
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
