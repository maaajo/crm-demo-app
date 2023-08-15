import { ReactNode } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";

interface LayoutProps {
  children?: ReactNode;
}

const Sidebar = () => {
  const user = useUser();

  //fix height for body

  return (
    <Box
      color={"gray.50"}
      bg={"gray.800"}
      w={64}
      pos="fixed"
      h="full"
      boxShadow={"xl"}
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
        height={"83%"}
        px={"5"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Flex>body</Flex>
        <Flex>{user?.email}</Flex>
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
