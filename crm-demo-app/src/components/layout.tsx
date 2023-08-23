import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { config } from "@/lib/config/config";

type LayoutProps = {
  children?: ReactNode;
  userEmail: string;
};

const Layout = ({ children, userEmail }: LayoutProps) => {
  return (
    <Flex>
      <Sidebar email={userEmail} />
      <Flex flex={1} ml={config.style.sidebarWidth} px={"10"} py={"8"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
