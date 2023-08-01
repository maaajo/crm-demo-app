import { Box, Flex, Text, BoxProps } from "@chakra-ui/react";

//https://chakra-templates.dev/navigation/sidebar

interface SidebarProps extends BoxProps {}

const TestSidebar = ({ ...rest }: SidebarProps) => {
  return (
    <>
      <Box
        bg={"white"}
        borderRight="1px"
        borderRightColor={"gray.200"}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Logo
          </Text>
        </Flex>
      </Box>
      <Box ml={60}>test</Box>
    </>
  );
};

export default TestSidebar;
