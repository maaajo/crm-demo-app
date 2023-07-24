import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import AuthHeader from "@/components/auth-header";
import EmailInput from "@/components/email-input";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Link } from "@chakra-ui/next-js";
import AuthLink from "@/components/auth-link";
import { routes } from "@/lib/routes";

const zodForgotSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled" })
    .email({ message: "This is not a valid email" }),
});

type ForgotSchema = z.infer<typeof zodForgotSchema>;

const ForgotPassword = () => {
  const supabase = useSupabaseClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(zodForgotSchema),
  });

  const { ref: formEmailRef, ...emailRest } = register("email");

  const onSubmit: SubmitHandler<ForgotSchema> = async (forgotData) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      forgotData.email,
      {
        redirectTo: `${window.location.origin}${routes.auth.passwordRecovery}`,
      }
    );

    console.log(data, error);
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
    </Box>
  );
};

export default ForgotPassword;
