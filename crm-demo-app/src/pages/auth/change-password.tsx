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
  Text,
} from "@chakra-ui/react";
import AuthHeader from "@/components/auth-header";
import PasswordInput from "@/components/password-input";
import * as z from "zod";
import validator from "validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import AuthModal from "@/components/auth-modal";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../../components/auth-layout";
import { GetServerSideProps } from "next";
import { checkPossibleRedirect } from "@/lib/auth/methods";
import { RedirectCheckType } from "@/lib/auth/methods";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";

const zodChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password field has to be filled" })
      .refine(validator.isStrongPassword, {
        message:
          "Password has to be at least 8 chars long and contain: 1 uppercase, 1 symbol and 1 number",
      }),
    "password-confirm": z
      .string()
      .min(1, { message: "Confirm password field has to be filled" })
      .refine(validator.isStrongPassword, {
        message:
          "Confirm password has to be at least 8 chars long and contain: 1 uppercase, 1 symbol and 1 number",
      }),
  })
  .refine((data) => data.password === data["password-confirm"], {
    message: "Passwords don't match",
    path: ["password-confirm"],
  });

type ChangePasswordSchema = z.infer<typeof zodChangePasswordSchema>;

// add check for error in query:
// http://localhost:3000/auth/change-password#error=unauthorized_client&error_code=401&error_description=Email+link+is+invalid+or+has+expired

const PasswordRecovery: NextPageWithLayout = () => {
  const supabase = useSupabaseClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { asPath } = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(zodChangePasswordSchema),
  });

  const { ref: formPasswordRef, ...passwordRest } = register("password");
  const { ref: formConfirmPasswordRef, ...passwordConfirmRest } =
    register("password-confirm");

  const onSubmit: SubmitHandler<ChangePasswordSchema> = async (
    changePasswordData
  ) => {
    const { data, error } = await supabase.auth.updateUser({
      password: changePasswordData.password,
    });

    if (error?.message) {
      toast({
        title: "Failed to update password ",
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

  useEffect(() => {
    const hash = asPath.split("#")[1];
    const parsedHash = new URLSearchParams(hash);
    setError(parsedHash.get("error_description") as string);
  }, [asPath]);

  return (
    <Box
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      {error ? (
        <VStack spacing={"6"}>
          <AuthHeader type="password_reset_error" my={"0"} />
          <Text>{error}</Text>
          <Button
            as={Link}
            href={routes.auth.signIn}
            variant={"solid"}
            color={"white"}
            _hover={{
              bgColor: "blackAlpha.800",
              textDecoration: "none",
            }}
            bgColor={"black"}
            leftIcon={<ArrowLeft />}
          >
            Back to Sign In
          </Button>
        </VStack>
      ) : (
        <>
          <AuthHeader type="change" />
          <chakra.form>
            <VStack spacing={"4"} width={"md"} alignItems={"flex-end"}>
              <FormControl isInvalid={Boolean(errors.password)}>
                <FormLabel fontWeight={"bold"}>Password</FormLabel>
                <PasswordInput
                  {...passwordRest}
                  name={"password"}
                  passwordRef={(e) => {
                    formPasswordRef(e);
                  }}
                  isDisabled={isSubmitting}
                />
                {errors.password && (
                  <FormErrorMessage>
                    {errors.password.message!.toString()}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={Boolean(errors["password-confirm"])}>
                <FormLabel fontWeight={"bold"}>Confirm Password</FormLabel>
                <PasswordInput
                  {...passwordConfirmRest}
                  name={"password-confirm"}
                  passwordRef={(e) => {
                    formConfirmPasswordRef(e);
                  }}
                  isDisabled={isSubmitting}
                />
                {errors["password-confirm"] && (
                  <FormErrorMessage>
                    {errors["password-confirm"].message!.toString()}
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
                loadingText={"Changing password..."}
                onClick={handleSubmit(onSubmit)}
              >
                Set New Password
              </Button>
            </VStack>
          </chakra.form>
          <AuthModal
            isOpen={isOpen}
            onClose={onClose}
            headingText="Password has been changed"
            bodyText="You're now logged in and set to go!"
            buttonHref={"/"}
            buttonText="Go back to home"
          />
        </>
      )}
    </Box>
  );
};

PasswordRecovery.getLayout = (page: ReactElement) => (
  <AuthLayout>{page}</AuthLayout>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const redirectPage = await checkPossibleRedirect(ctx, RedirectCheckType.Auth);

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

export default PasswordRecovery;
