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
  VStack,
  Button,
} from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { LogOut, MoreHorizontal, User2 } from "lucide-react";
import { Link } from "@chakra-ui/next-js";
import { routes } from "@/lib/routes";
import { useRouter } from "next/router";

interface LayoutProps {
  children?: ReactNode;
}

const Sidebar = () => {
  //this revalidates on each tab change
  //maybe use in use effect?
  //extarct to a component
  //use navitem
  //use list
  const user = useUser();
  const router = useRouter();

  const isActive = router.pathname === "/accounts";
  console.log(isActive);

  return (
    <Box
      color={"whiteAlpha.700"}
      bg={"blackAlpha.900"}
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
        color={"whiteAlpha.900"}
      >
        CRM Playground
      </Text>
      <Flex
        flex={1}
        px={"3"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <VStack mt={"4"} alignItems={"flex-start"} flex={8}>
          <Button
            leftIcon={<User2 />}
            iconSpacing={"5"}
            justifyContent={"flex-start"}
            w={"full"}
            variant={"link"}
            color={isActive ? "whiteAlpha.900" : "whiteAlpha.700"}
            py={"3"}
            pl={"3"}
            fontWeight={"semibold"}
            borderRadius={"xl"}
            _hover={{
              backgroundColor: "whiteAlpha.200",
              color: "whiteAlpha.900",
              textDecoration: "none",
            }}
            backgroundColor={isActive ? "whiteAlpha.200" : "initial"}
            as={Link}
            href={"/accounts"}
          >
            Accounts
          </Button>
        </VStack>
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
              color={"whiteAlpha.700"}
            />
            <MenuList
              color={"whiteAlpha.700"}
              backgroundColor={"blackAlpha.900"}
              fontSize={"sm"}
            >
              <MenuItem
                icon={<LogOut size={18} />}
                fontWeight={"semibold"}
                backgroundColor={"blackAlpha.900"}
                _hover={{
                  backgroundColor: "whiteAlpha.200",
                  textDecoration: "none",
                  color: "whiteAlpha.900",
                }}
                color={"whiteAlpha.700"}
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
