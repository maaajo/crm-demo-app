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
//@ts-ignore
import ColorThief from "colorthief";
import { useRef, useState } from "react";
import { getImageBackgroundColor } from "@/lib/utils";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userProfile } = useUserProfileContext();
  const avatarImageRef = useRef<HTMLImageElement>(null);
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(15px) hue-rotate(90deg)"
      />
      <ModalContent>
        <Box
          height={"125px"}
          w={"full"}
          backgroundColor={`rgb(${avatarBackgroundColor})`}
        ></Box>
        <ModalBody
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          mt={"-16"}
        >
          <Image
            alt="user avatar"
            maxH={"180px"}
            objectFit={"cover"}
            mt={-24}
            src={userProfile.avatar_uri ?? ""}
            borderRadius={"lg"}
            boxShadow={"xl"}
            transition={"transform ease .3s"}
            _hover={{
              transform: "scale(1.04)",
            }}
            crossOrigin="anonymous"
            ref={avatarImageRef}
            onLoad={() => {
              const color = getImageBackgroundColor(avatarImageRef.current!);
              setAvatarBackgroundColor(color);
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

        <ModalFooter
          display={"flex"}
          justifyContent={"center"}
          width={"full"}
          pb={8}
        >
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
