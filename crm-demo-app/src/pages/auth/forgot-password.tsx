import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  chakra,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Heading,
} from "@chakra-ui/react";
import AuthHeader from "@/components/auth-header";
import EmailInput from "@/components/email-input";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import AuthLink from "@/components/auth-link";
import { routes } from "@/lib/routes";
import { Link } from "@chakra-ui/next-js";

const zodForgotSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled" })
    .email({ message: "This is not a valid email" }),
});

type ForgotSchema = z.infer<typeof zodForgotSchema>;

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConfirmationModal = ({ isOpen, onClose }: ConfirmationModalProps) => {
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
      <ModalContent>
        <ModalCloseButton />
        <ModalBody textAlign={"center"} mt={20} mb={6}>
          <Heading size={"md"} as={"h5"}>
            Email has been sent!
          </Heading>
          <Text mt={"5"} color={"blackAlpha.700"}>
            Please check your inbox and click on the received link to reset a
            password
          </Text>
        </ModalBody>

        <ModalFooter display={"flex"} justifyContent={"center"} width={"full"}>
          <Button
            as={Link}
            href={routes.auth.signIn}
            width={"full"}
            variant={"solid"}
            color={"white"}
            _hover={{
              bgColor: "blackAlpha.800",
              textDecoration: "none",
            }}
            bgColor={"black"}
          >
            Go back to sign in
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ForgotPassword = () => {
  const toast = useToast();
  const supabase = useSupabaseClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(zodForgotSchema),
  });

  const { ref: formEmailRef, ...emailRest } = register("email");

  const onSubmit: SubmitHandler<ForgotSchema> = async (forgotData) => {
    const { data: _, error } = await supabase.auth.resetPasswordForEmail(
      forgotData.email,
      {
        redirectTo: `${window.location.origin}${routes.auth.passwordRecovery}`,
      }
    );

    if (error?.message) {
      toast({
        title: "Failed to reset ",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 10000,
      });

      return;
    }

    onOpen();
  };

  return (
    <Box
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <AuthHeader type="forgot" />
      <chakra.form>
        <VStack spacing={"4"} width={"md"} alignItems={"flex-end"}>
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel fontWeight={"bold"}>Enter your email</FormLabel>
            <EmailInput
              {...emailRest}
              name={"email"}
              emailRef={(e) => {
                formEmailRef(e);
              }}
              isDisabled={isSubmitting}
            />
            {errors.email && (
              <FormErrorMessage>
                {errors.email.message!.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            variant={"solid"}
            width={"full"}
            type={"submit"}
            bgColor={"black"}
            color={"white"}
            _hover={{
              bgColor: "blackAlpha.800",
            }}
            isLoading={isSubmitting}
            loadingText={"Resetting..."}
            onClick={handleSubmit(onSubmit)}
          >
            Reset Password
          </Button>
        </VStack>
      </chakra.form>
      <AuthLink type="forgot" />
      <ConfirmationModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default ForgotPassword;
