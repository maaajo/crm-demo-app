import { ReactNode } from "react";
import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { LogOut } from "lucide-react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";

interface LayoutProps {
  children?: ReactNode;
}

const Sidebar = () => {
  const user = useUser();

  return (
    <Box
      color={"gray.50"}
      bg={"gray.800"}
      w={64}
      pos="fixed"
      h="100vh"
      boxShadow={"xl"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Text
        fontSize="2xl"
        fontWeight="extrabold"
        py={"8"}
        letterSpacing={"tight"}
        textAlign={"center"}
        as={"h3"}
      >
        CRM Playground
      </Text>
      <Flex
        flex={1}
        px={"5"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Flex flex={9}>body</Flex>
        <Flex flex={1} flexDirection={"column"}>
          <Text>{user?.email}</Text>
          <IconButton
            aria-label="Log Out"
            as={Link}
            href={routes.auth.signOut}
            icon={<LogOut />}
            variant={"ghost"}
            colorScheme={"whiteAlpha"}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <Flex>
      <Sidebar />
      <Flex ml={"64"} pl={"4"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
