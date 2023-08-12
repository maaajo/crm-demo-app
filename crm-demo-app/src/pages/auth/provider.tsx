import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../auth-layout";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const ProviderAuthRedirect: NextPageWithLayout = () => {
  const router = useRouter();
  const toast = useToast();
  const { isLoading, session, error } = useSessionContext();

  if (error?.message) {
    toast({
      title: "Failed to authenticate",
      description: error.message,
      status: "error",
      isClosable: true,
      position: "top",
      duration: 10000,
    });
  }

  useEffect(() => {
    if (!isLoading && session) {
      void router.push("/");
    }
  }, [isLoading, session]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      w={"full"}
    >
      <Text
        mb={"4"}
        fontSize={"xl"}
        fontWeight={"semibold"}
        letterSpacing={"tight"}
      >
        Redirecting...
      </Text>
      <Spinner
        thickness="6px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blackAlpha.900"
        size="xl"
      />
    </Flex>
  );
};

ProviderAuthRedirect.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ProviderAuthRedirect;
