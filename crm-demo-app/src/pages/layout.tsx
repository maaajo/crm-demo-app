import { ReactNode } from "react";
import {
  Box,
  Text,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
} from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { LogOut, MoreHorizontal } from "lucide-react";
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
        <Flex flex={8}>body</Flex>
        <HStack
          spacing={"4"}
          flex={1}
          align={"center"}
          justifyContent={"center"}
        >
          <Text fontWeight={"semibold"} fontSize={"sm"}>
            {user?.email}
          </Text>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Open more actions for account"
              icon={<MoreHorizontal />}
              variant={"unstyled"}
              colorScheme={"whiteAlpha"}
            />
            <MenuList
              color={"whiteAlpha.900"}
              backgroundColor={"gray.800"}
              fontSize={"sm"}
            >
              <MenuItem
                icon={<LogOut size={18} />}
                fontWeight={"semibold"}
                backgroundColor={"gray.800"}
                _hover={{ backgroundColor: "gray.700", textDecoration: "none" }}
                color={"whiteAlpha.900"}
                as={Link}
                href={routes.auth.signOut}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
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
