import { routes } from "@/lib/routes";
import { TAuthKeys, AuthTypes } from "@/lib/types/auth-types";
import { Link } from "@chakra-ui/next-js";
import { Text } from "@chakra-ui/react";

const createReturnObject = (text: string, linkText: string, href: string) => {
  return { text, linkText, href };
};

const getText = (type: string) => {
  switch (type) {
    case AuthTypes.Register:
      return createReturnObject(
        "Already have an account? ",
        "Sign in here",
        routes.auth.signIn
      );
    case AuthTypes.Login:
      return createReturnObject(
        "Don't have an account? ",
        "Create new account here",
        routes.auth.signUp
      );
    case AuthTypes.Forgot:
      return createReturnObject(
        "Changed your mind? ",
        "Go back to sign in",
        routes.auth.signIn
      );
    default:
      return createReturnObject("", "", "");
  }
};

const AuthLink = ({ type }: TAuthKeys) => {
  const { text, linkText, href } = getText(type);

  return (
    <Text color={"blackAlpha.800"} mt={"6"}>
      {text}
      <Link color={"blue.600"} href={href}>
        {linkText}
      </Link>
    </Text>
  );
};

export default AuthLink;
