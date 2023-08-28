import { routes, mainPages } from "@/lib/routes";
import {
  Box,
  Flex,
  VStack,
  Button,
  HStack,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Text,
  Menu,
} from "@chakra-ui/react";
import { User2, MoreHorizontal, LogOut, Home } from "lucide-react";
import { config } from "@/lib/config/config";
import { Link } from "@chakra-ui/next-js";
import { usePathname } from "next/navigation";
import { toTitleCase } from "@/lib/utils";

type NavItemProps = {
  icon: JSX.Element;
  id?: string;
  href: string;
  title: string;
};

const navItems: NavItemProps[] = [
  {
    icon: <Home />,
    id: "adsqwd",
    href: routes.home,
    title: toTitleCase(mainPages.home),
  },
  {
    icon: <User2 />,
    id: "ddshj123",
    href: routes.accounts.index,
    title: toTitleCase(mainPages.accounts),
  },
];

const isNavItemActive = (path: string, href: string) => {
  if (href === "/") {
    return path === href;
  }

  return path.toLowerCase().includes(href.toLowerCase());
};

const NavItem = ({ icon, href, title }: NavItemProps) => {
  const path = usePathname();

  const isActive = isNavItemActive(path, href);

  return (
    <Button
      leftIcon={icon}
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
      href={href}
    >
      {title}
    </Button>
  );
};

type SidebarProps = {
  email: string;
};

const Sidebar = ({ email }: SidebarProps) => {
  return (
    <Box
      color={"whiteAlpha.700"}
      bg={"blackAlpha.900"}
      w={config.style.sidebarWidth}
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
        {config.appName}
      </Text>
      <Flex
        flex={1}
        px={"3"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <VStack mt={"4"} alignItems={"flex-start"} flex={8}>
          {navItems.map(({ href, icon, id, title }) => {
            return <NavItem key={id} href={href} icon={icon} title={title} />;
          })}
        </VStack>
        <HStack
          spacing={"4"}
          flex={1}
          align={"center"}
          justifyContent={"center"}
        >
          <Text fontWeight={"semibold"} fontSize={"sm"}>
            {email}
          </Text>
          <Menu placement={"right-end"}>
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

export default Sidebar;
