import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type AuthLayoutProps = {
  children?: ReactNode;
};

const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;

  return <Flex minHeight="100vh">{children}</Flex>;
};

export default AuthLayout;
