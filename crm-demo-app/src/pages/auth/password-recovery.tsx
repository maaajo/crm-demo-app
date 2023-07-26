import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  VStack,
  chakra,
} from "@chakra-ui/react";
import AuthHeader from "@/components/auth-header";
import PasswordInput from "@/components/password-input";
import * as z from "zod";
import validator from "validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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

const PasswordRecovery = () => {
  const supabase = useSupabaseClient();

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
    console.log(changePasswordData);
  };

  return (
    <Box
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
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
    </Box>
  );
};

export default PasswordRecovery;
