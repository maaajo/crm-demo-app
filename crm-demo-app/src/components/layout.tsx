import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { config } from "@/lib/config/config";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { ArrowLeftCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Head from "next/head";

type LayoutProps = {
  children?: ReactNode;
  userEmail: string;
};

const Layout = ({ children, userEmail }: LayoutProps) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Flex minH={"100vh"}>
      <Sidebar email={userEmail} />
      <Flex flex={1} ml={config.style.sidebarWidth} px={"10"} py={"8"}>
        <Box
          w={"full"}
          py={"6"}
          px={"4"}
          backgroundColor={"whiteAlpha.800"}
          borderRadius={"lg"}
          boxShadow={"sm"}
          borderWidth={"thin"}
          borderColor={"blackAlpha.300"}
        >
          {path !== routes.home ? (
            <Button
              display={"inline-flex"}
              variant={"unstyled"}
              leftIcon={<ArrowLeftCircle />}
              size={"sm"}
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          ) : null}

          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
