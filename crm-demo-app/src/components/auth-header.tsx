import { TAuthKeys, AuthTypes } from "@/lib/types/auth-types";
import { VStack, Heading, Text, StackProps } from "@chakra-ui/react";

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
    case AuthTypes.Change:
      return createReturnObject(
        "Choose new password",
        "Almost there! Enter your new password and you're all set."
      );
    case AuthTypes.Password_Reset_Error:
      return createReturnObject(
        "Oops, something went wrong!",
        "We've found unexpected error, full message can be found below:"
      );
    default:
      return createReturnObject("", "");
  }
};

interface AuthHeaderProps extends StackProps, TAuthKeys {}

const AuthHeader = ({ type, ...rest }: AuthHeaderProps) => {
  const { headerText, supportingText } = getText(type);

  return (
    <VStack spacing={"1"} my={"8"} {...rest}>
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
