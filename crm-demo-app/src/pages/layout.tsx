import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import Sidebar from "@/components/sidebar";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const user = useUser();
  let userEmail = "";

  if (user) {
    userEmail = user.email ?? "placeholder@gmail.com";
  }

  return (
    <Flex>
      <Sidebar email={userEmail} />
      <Flex ml={"64"} pl={"4"}>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
