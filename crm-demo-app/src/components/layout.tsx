import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { config } from "@/lib/config/config";

type LayoutProps = {
  children?: ReactNode;
  userEmail: string;
};

const Layout = ({ children, userEmail }: LayoutProps) => {
  return (
    <Flex minH={"100vh"}>
      <Sidebar email={userEmail} />
      <Flex flex={1} ml={config.style.sidebarWidth} px={"10"} py={"8"}>
        <Box
          w={"full"}
          py={"10"}
          px={"4"}
          backgroundColor={"whiteAlpha.600"}
          borderRadius={"lg"}
          boxShadow={"sm"}
          borderWidth={"thin"}
          borderColor={"blackAlpha.300"}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
