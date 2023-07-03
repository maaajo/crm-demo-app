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
} from "@chakra-ui/react";
import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Google, Github } from "grommet-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const SignUp = () => {
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { ref: formEmailRef, ...emailRest } = register("email");
  const { ref: formPasswordRef, ...passwordRest } = register("password");

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    console.log(formData);
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
        <FormControl>
          <FormLabel fontWeight={"bold"}>Email Address</FormLabel>
          <EmailInput
            {...emailRest}
            name={"email"}
            emailRef={(e) => {
              formEmailRef(e);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={"bold"}>Password</FormLabel>
          <PasswordInput
            {...passwordRest}
            name={"password"}
            passwordRef={(e) => {
              formPasswordRef(e);
            }}
          />
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
