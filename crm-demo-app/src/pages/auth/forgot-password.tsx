import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  chakra,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import AuthHeader from "@/components/auth-header";
import EmailInput from "@/components/email-input";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import AuthLink from "@/components/auth-link";
import { routes } from "@/lib/routes";
import AuthModal from "@/components/notificationModal";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../../components/auth-layout";
import { GetServerSideProps } from "next";
import { RedirectCheckType, checkPossibleRedirect } from "@/lib/auth/methods";
import Head from "next/head";
import { config } from "@/lib/config/config";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/types/supabase";

const zodForgotSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled" })
    .email({ message: "This is not a valid email" }),
});

type ForgotSchema = z.infer<typeof zodForgotSchema>;

const ForgotPassword: NextPageWithLayout = () => {
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
    <>
      <Head>
        <title>{`${config.appName} - Forgot Password`}</title>
      </Head>
      <Box
        width={"full"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <AuthHeader type="forgot" />
        <chakra.form>
          <VStack spacing={"4"} width={"md"}>
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
        <AuthModal
          type={"info"}
          isOpen={isOpen}
          onClose={onClose}
          headingText="Email has been sent!"
          bodyText="Please check your inbox and click on the received link to reset a password"
          buttonHref={routes.auth.signIn}
          buttonText="Go back to sign in"
        />
      </Box>
    </>
  );
};

ForgotPassword.getLayout = (page: ReactElement) => (
  <AuthLayout>{page}</AuthLayout>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient<Database>(ctx);
  const redirectPage = await checkPossibleRedirect(
    supabase,
    RedirectCheckType.Auth
  );

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default ForgotPassword;
