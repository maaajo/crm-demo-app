import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import PasswordInput from "@/components/password-input";

const SignUp = () => {
  return (
    <Flex width={"full"} justifyContent={"center"} alignItems={"center"}>
      <VStack spacing={"2"} width={"md"}>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <Input type={"email"} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <PasswordInput />
        </FormControl>
      </VStack>
    </Flex>
  );
};

export default SignUp;
