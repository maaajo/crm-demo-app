import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  Button,
  AbsoluteCenter,
  Divider,
  chakra,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Google, Github } from "grommet-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled" })
    .email({ message: "This is not a valid email" }),
  password: z.string().refine(validator.isStrongPassword, {
    message: "Password not strong enough",
  }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { ref: formEmailRef, ...emailRest } = register("email");
  const { ref: formPasswordRef, ...passwordRest } = register("password");

  const onSubmit: SubmitHandler<SignUpSchema> = (data) => {
    console.log(errors);
  };

  return (
    <chakra.form
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack spacing={"4"} width={"md"}>
        <FormControl isInvalid={Boolean(errors.email)}>
          <FormLabel fontWeight={"bold"}>Email Address</FormLabel>
          <EmailInput
            {...emailRest}
            name={"email"}
            emailRef={(e) => {
              formEmailRef(e);
            }}
          />
          {errors.email && (
            <FormErrorMessage>
              {errors.email.message!.toString()}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={Boolean(errors.password)}>
          <FormLabel fontWeight={"bold"}>Password</FormLabel>
          <PasswordInput
            {...passwordRest}
            name={"password"}
            passwordRef={(e) => {
              formPasswordRef(e);
            }}
          />
          {errors.password && (
            <FormErrorMessage>
              {errors.password.message!.toString()}
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
        >
          Create Account
        </Button>
      </VStack>
      <Box position={"relative"} py={8} w={"md"}>
        <Divider borderColor={"blackAlpha.700"} variant={"solid"} />
        <AbsoluteCenter fontWeight={"bold"} bg="white" px="6">
          Or
        </AbsoluteCenter>
      </Box>
      <VStack width={"md"} spacing={4}>
        <Button
          leftIcon={<Google color={"brand"} />}
          width={"full"}
          variant={"outline"}
          colorScheme={"blackAlpha"}
          color={"blackAlpha.900"}
        >
          Sign in with Google
        </Button>
        <Button
          leftIcon={<Github color={"brand"} />}
          width={"full"}
          variant={"outline"}
          colorScheme={"blackAlpha"}
          color={"blackAlpha.900"}
        >
          Sign in with Github
        </Button>
      </VStack>
    </chakra.form>
  );
};

export default SignUp;
