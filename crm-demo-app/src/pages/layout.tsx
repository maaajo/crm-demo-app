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
      <Flex ml={"64"} pl={"4"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
