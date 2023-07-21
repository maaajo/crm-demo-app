import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  Button,
  AbsoluteCenter,
  Divider,
  chakra,
  FormErrorMessage,
  useToast,
  Text,
} from "@chakra-ui/react";
import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Google, Github } from "grommet-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { useRouter } from "next/router";
import { NextPage, GetServerSideProps } from "next";
import { Link } from "@chakra-ui/next-js";

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field has to be filled" })
    .email({ message: "This is not a valid email" }),
  password: z
    .string()
    .min(1, { message: "Password field has to be filled" })
    .refine(validator.isStrongPassword, {
      message:
        "Password has to be at least 8 chars long and contain: 1 uppercase, 1 symbol and 1 number",
    }),
});

const config = {
  signUp: {
    loadingMessage: "Signing up...",
  },
};

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUp: NextPage = () => {
  const toast = useToast();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { ref: formEmailRef, ...emailRest } = register("email");
  const { ref: formPasswordRef, ...passwordRest } = register("password");

  const onSubmit: SubmitHandler<SignUpSchema> = async (signUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {},
    });

    if (data.session) {
      router.reload();
    }

    if (error) {
      toast({
        title: "Failed to register",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 10000,
      });
    }
  };

  const onGithubLogin = async () => {
    const { data: _, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error?.message) {
      toast({
        title: "Failed to sign in with Github",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 10000,
      });
    }
  };

  const onGoogleLogin = async () => {
    const { data: _, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error?.message) {
      toast({
        title: "Failed to sign in with Google",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 10000,
      });
    }
  };

  return (
    <Box
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <chakra.form>
        <VStack spacing={"4"} width={"md"}>
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel fontWeight={"bold"}>Email Address</FormLabel>
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
            loadingText={config.signUp.loadingMessage}
            onClick={handleSubmit(onSubmit)}
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
      </chakra.form>
      <>
        <VStack width={"md"} spacing={4}>
          <Button
            leftIcon={<Google color={"brand"} />}
            width={"full"}
            variant={"outline"}
            colorScheme={"blackAlpha"}
            color={"blackAlpha.900"}
            isLoading={isSubmitting}
            loadingText={config.signUp.loadingMessage}
            type={"button"}
            onClick={onGoogleLogin}
          >
            Sign in with Google
          </Button>
          <Button
            leftIcon={<Github color={"brand"} />}
            width={"full"}
            variant={"outline"}
            colorScheme={"blackAlpha"}
            color={"blackAlpha.900"}
            isLoading={isSubmitting}
            loadingText={config.signUp.loadingMessage}
            type={"button"}
            onClick={onGithubLogin}
          >
            Sign in with Github
          </Button>
        </VStack>
        <Text color={"blackAlpha.800"} mt={"6"}>
          Already have an account?{" "}
          <Link color={"blue.600"} href={"/auth/sign-in"}>
            Sign in here
          </Link>
        </Text>
      </>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignUp;
