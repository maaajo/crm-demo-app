import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  AbsoluteCenter,
  Divider,
  HStack,
} from "@chakra-ui/react";
import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Google, Github } from "grommet-icons";

const SignUp = () => {
  return (
    <Flex
      width={"full"}
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
    >
      <VStack spacing={"4"} width={"md"}>
        <FormControl>
          <FormLabel fontWeight={"bold"}>Email Address</FormLabel>
          <EmailInput />
        </FormControl>
        <FormControl>
          <FormLabel fontWeight={"bold"}>Password</FormLabel>
          <PasswordInput />
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
          Create account with Google
        </Button>
        <Button
          leftIcon={<Github color={"brand"} />}
          width={"full"}
          variant={"outline"}
          colorScheme={"blackAlpha"}
          color={"blackAlpha.900"}
        >
          Create account with Github
        </Button>
      </VStack>
    </Flex>
  );
};

export default SignUp;
