import { TAuthKeys, AuthTypes } from "@/lib/types/auth-types";
import { VStack, Heading, Text } from "@chakra-ui/react";

const createReturnObject = (headerText: string, supportingText: string) => {
  return { headerText, supportingText };
};

const getText = (type: string) => {
  switch (type) {
    case AuthTypes.Register:
      return createReturnObject(
        "Create new account",
        "Sign up to unlock full access"
      );
    case AuthTypes.Login:
      return createReturnObject("Welcome back!", "Log in to your account");
    case AuthTypes.Forgot:
      return createReturnObject(
        "Forgot password?",
        "No worries, we'll send you reset instructions"
      );
    default:
      return createReturnObject("", "");
  }
};

const AuthHeader = ({ type }: TAuthKeys) => {
  const { headerText, supportingText } = getText(type);

  return (
    <VStack spacing={"1"} my={"8"}>
      <Heading as={"h3"} letterSpacing={"tight"} fontWeight={"bold"}>
        {headerText}
      </Heading>
      <Text color={"blackAlpha.600"} fontSize={"md"}>
        {supportingText}
      </Text>
    </VStack>
  );
};

export default AuthHeader;
