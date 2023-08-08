import { ReactNode } from "react";
import { Box, Text, Flex, Container } from "@chakra-ui/react";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <Flex>
      <Box
        bg={"white"}
        borderRight="1px"
        borderRightColor={"gray.200"}
        w={{ base: "full", md: "64" }}
        pos="fixed"
        h="full"
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
        </Flex>
      </Box>
      <Flex ml={"64"} pl={"4"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
