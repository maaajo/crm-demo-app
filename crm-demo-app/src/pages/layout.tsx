import { ReactNode } from "react";
import { Container, Flex } from "@chakra-ui/react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <Container as={Flex} maxW={"container.xl"} minHeight="100vh">
      {children}
    </Container>
  );
};

export default Layout;
