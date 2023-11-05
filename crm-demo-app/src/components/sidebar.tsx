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
  Tag,
  Avatar,
  TagLabel,
  Spinner,
  StackDivider,
} from "@chakra-ui/react";
import {
  User2,
  MoreHorizontal,
  LogOut,
  Home,
  MoreVertical,
  Contact,
} from "lucide-react";
import { config } from "@/lib/config/config";
import { Link } from "@chakra-ui/next-js";
import { usePathname } from "next/navigation";
import startCase from "lodash.startcase";
import { useUserProfileContext } from "@/lib/context/user-profile";

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
    title: startCase(mainPages.home),
  },
  {
    icon: <User2 />,
    id: "ddshj123",
    href: routes.accounts.index,
    title: startCase(mainPages.accounts),
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

const Sidebar = () => {
  const { userProfile } = useUserProfileContext();
  return (
    <Box
      color={"whiteAlpha.700"}
      backgroundColor={config.style.sidebar.backgroundColor}
      w={config.style.sidebar.width}
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
          <Tag
            colorScheme={"whiteAlpha"}
            backgroundColor={"whiteAlpha.300"}
            variant={"solid"}
            boxShadow={"xl"}
            borderRadius={"full"}
            py={1}
            px={2}
          >
            {userProfile.isLoading ? (
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color={"whiteAlpha.900"}
                size="sm"
              />
            ) : (
              <>
                <Avatar
                  src={userProfile.avatarUri}
                  size={"xs"}
                  name={userProfile.emailAddress}
                  ml={1}
                  mr={2}
                />
                <TagLabel fontSize={"xs"}>{userProfile.emailAddress}</TagLabel>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Open more actions for account"
                    icon={<MoreHorizontal />}
                    variant={"unstyled"}
                    color={"whiteAlpha.900"}
                    size={"xs"}
                    ml={2}
                  />
                  <MenuList
                    fontSize={"sm"}
                    backgroundColor={config.style.sidebar.backgroundColor}
                    boxShadow={"lg"}
                    borderColor={"whiteAlpha.700"}
                    px={2}
                  >
                    <VStack
                      spacing={1}
                      divider={<StackDivider borderColor={"whiteAlpha.500"} />}
                    >
                      <MenuItem
                        icon={<Contact size={18} />}
                        fontWeight={"semibold"}
                        backgroundColor={config.style.sidebar.backgroundColor}
                        as={Link}
                        href={routes.profile}
                        color={"whiteAlpha.900"}
                        _hover={{
                          textDecoration: "none",
                          backgroundColor: "whiteAlpha.300",
                        }}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        icon={<LogOut size={18} />}
                        fontWeight={"semibold"}
                        backgroundColor={config.style.sidebar.backgroundColor}
                        as={Link}
                        href={routes.auth.signOut}
                        color={"whiteAlpha.900"}
                        _hover={{
                          textDecoration: "none",
                          backgroundColor: "whiteAlpha.300",
                        }}
                      >
                        Log Out
                      </MenuItem>
                    </VStack>
                  </MenuList>
                </Menu>
              </>
            )}
          </Tag>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Sidebar;
