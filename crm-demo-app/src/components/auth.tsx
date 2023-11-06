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
} from "@chakra-ui/react";
import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Google, Github } from "grommet-icons";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { useRouter } from "next/router";
import { Link } from "@chakra-ui/next-js";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { TAuthKeys, AuthTypes } from "@/lib/types/auth";
import AuthHeader from "./auth-header";
import AuthLink from "./auth-link";
import { routes } from "@/lib/routes";
import { AuthCallbackQueryParams } from "@/lib/auth/methods";
import { config } from "@/lib/config/config";
import { getAvatar, getCurrentTimestampWithTimezone } from "@/lib/utils";

const zodAuthSchema = z.object({
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

type AuthSchema = z.infer<typeof zodAuthSchema>;

type AuthParams = {
  type: TAuthKeys;
};

const Auth = ({ type }: AuthParams) => {
  const toast = useToast();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const queryParams = router.query as AuthCallbackQueryParams;
  const returnURL = queryParams[
    config.authCallbackQueryParam as keyof AuthCallbackQueryParams
  ] as string | undefined;
  const returnURLQueryParam = `?${config.authCallbackQueryParam}=${
    returnURL ? returnURL : routes.home
  }`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSchema>({
    resolver: zodResolver(zodAuthSchema),
  });

  const { ref: formEmailRef, ...emailRest } = register("email");
  const { ref: formPasswordRef, ...passwordRest } = register("password");

  const onSubmit: SubmitHandler<AuthSchema> = async (signUpData) => {
    const supabaseCredentials:
      | SignUpWithPasswordCredentials
      | SignInWithPasswordCredentials = {
      password: signUpData.password,
      email: signUpData.email,
      options: {},
    };

    const { data, error } =
      type === AuthTypes.Login
        ? await supabase.auth.signInWithPassword(supabaseCredentials)
        : await supabase.auth.signUp(supabaseCredentials);

    if (data.session) {
      // this should be only updated if avatar is empty //TODO
      await supabase
        .from("profile")
        .update({
          avatar_uri: getAvatar(),
        })
        .eq("id", data.session.user.id);

      router.reload();
    }

    if (error) {
      console.log(error);
      toast({
        title: "Failed to register",
        description: error.message,
        status: "error",
      });
    }
  };

  const onGithubLogin = async () => {
    const { data: _, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}${routes.auth.provider}${returnURLQueryParam}`,
      },
    });

    if (error?.message) {
      toast({
        title: "Failed to sign in with Github",
        description: error.message,
        status: "error",
      });
    }
  };

  const onGoogleLogin = async () => {
    const { data: _, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}${routes.auth.provider}${returnURLQueryParam}`,
      },
    });

    if (error?.message) {
      toast({
        title: "Failed to sign in with Google",
        description: error.message,
        status: "error",
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
      <AuthHeader type={type} />
      <chakra.form>
        <VStack spacing={"4"} width={"md"} alignItems={"flex-end"}>
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
          {type === AuthTypes.Login ? (
            <Link
              color={"blue.600"}
              href={routes.auth.forgot}
              marginTop={"-2"}
              fontSize={"sm"}
            >
              Forgot password?
            </Link>
          ) : null}
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
            {type === AuthTypes.Login ? "Login" : "Create Account"}
          </Button>
        </VStack>
        <Box position={"relative"} py={8} w={"md"}>
          <Divider borderColor={"blackAlpha.700"} variant={"solid"} />
          <AbsoluteCenter fontWeight={"normal"} bg="white" px="6">
            Or continue with
          </AbsoluteCenter>
        </Box>
      </chakra.form>
      <>
        <VStack width={"md"} spacing={4}>
          <Button
            leftIcon={<Google color={"brand"} />}
            width={"full"}
            variant={"blackWhiteOutline"}
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
            variant={"blackWhiteOutline"}
            isLoading={isSubmitting}
            loadingText={config.signUp.loadingMessage}
            type={"button"}
            onClick={onGithubLogin}
          >
            Sign in with Github
          </Button>
        </VStack>
        <AuthLink type={type} cb={returnURLQueryParam} />
      </>
    </Box>
  );
};

export default Auth;
