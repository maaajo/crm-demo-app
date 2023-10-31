import { routes } from "@/lib/routes";
import { TAuthKeys, AuthTypes } from "@/lib/types/auth";
import { Link } from "@chakra-ui/next-js";
import { Text } from "@chakra-ui/react";

type AuthLinkProps = {
  type: TAuthKeys;
  cb: string;
};

const createReturnObject = (text: string, linkText: string, href: string) => {
  return { text, linkText, href };
};

const getText = (type: string, cb: string) => {
  switch (type) {
    case AuthTypes.Register:
      return createReturnObject(
        "Already have an account? ",
        "Sign in here",
        `${routes.auth.signIn}${cb}`
      );
    case AuthTypes.Login:
      return createReturnObject(
        "Don't have an account? ",
        "Create new account here",
        `${routes.auth.signUp}${cb}`
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

const AuthLink = ({ type, cb }: AuthLinkProps) => {
  const { text, linkText, href } = getText(type, cb);

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
