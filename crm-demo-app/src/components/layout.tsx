import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";

type LayoutProps = {
  children?: ReactNode;
  userEmail: string;
};

const Layout = ({ children, userEmail }: LayoutProps) => {
  return (
    <Flex>
      <Sidebar email={userEmail} />
      <Flex minH={"100vh"} ml={"64"} pl={"4"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
