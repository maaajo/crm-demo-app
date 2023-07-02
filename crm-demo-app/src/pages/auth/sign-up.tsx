import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  Button,
  AbsoluteCenter,
  Divider,
  chakra,
} from "@chakra-ui/react";
import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Google, Github } from "grommet-icons";
import { FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SignUp = () => {
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    });

    console.log(data, error);
  };

  return (
    <chakra.form
      width={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      onSubmit={handleSubmit}
    >
      <VStack spacing={"4"} width={"md"}>
        <FormControl>
          <FormLabel fontWeight={"bold"}>Email Address</FormLabel>
          <EmailInput name="email" />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={"bold"}>Password</FormLabel>
          <PasswordInput name="password" />
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
