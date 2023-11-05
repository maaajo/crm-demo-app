import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import { config } from "@/lib/config/config";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { ArrowLeftCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <Flex minH={"100vh"}>
      <Sidebar />
      <Flex
        flex={1}
        ml={config.style.sidebarWidth}
        px={"10"}
        py={"8"}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
      >
        {path !== routes.home ? (
          <Button
            display={"inline-flex"}
            variant={"unstyled"}
            leftIcon={<ArrowLeftCircle />}
            size={"sm"}
            onClick={() => router.back()}
            pb={4}
          >
            Go Back
          </Button>
        ) : null}
        <Box
          w={"full"}
          px={"6"}
          py={"2"}
          backgroundColor={"whiteAlpha.800"}
          borderRadius={"lg"}
          boxShadow={"sm"}
          borderWidth={"thin"}
          borderColor={"blackAlpha.300"}
          display={"flex"}
          flexDirection={"column"}
          flex={1}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
