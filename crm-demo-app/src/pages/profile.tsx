import PageTitle from "@/components/page-title";
import { config } from "@/lib/config/config";
import { useUserProfileContext } from "@/lib/context/user-profile";
import { Avatar, AvatarBadge, HStack, VStack, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function ProfilePage() {
  const { userProfile } = useUserProfileContext();
  return (
    <>
      <Head>
        <title>{`${config.appName} - Home`}</title>
      </Head>
      <PageTitle title="Profile" />
      <HStack px={4} alignItems={"start"} spacing={6}>
        <Avatar
          size={"2xl"}
          name={userProfile.email}
          src={userProfile.avatar_uri ?? ""}
        >
          <AvatarBadge boxSize={".9em"} bg={"green.500"} />
        </Avatar>
        <VStack mt={2} alignItems={"start"}>
          <VStack spacing={0} alignItems={"start"}>
            <Text fontWeight={"extrabold"}>Email:</Text>
            <Text fontSize={"sm"}>{userProfile.email}</Text>
          </VStack>
          <VStack spacing={0} alignItems={"start"}>
            <Text fontWeight={"extrabold"}>Id:</Text>
            <Text fontSize={"sm"}>{userProfile.user_id}</Text>
          </VStack>
          <VStack spacing={0} alignItems={"start"}>
            <Text fontWeight={"extrabold"}>Registered:</Text>
            <Text fontSize={"sm"}>{userProfile.created_at}</Text>
          </VStack>
          <VStack spacing={0} alignItems={"start"}>
            <Text fontWeight={"extrabold"}>Last sign in:</Text>
            <Text fontSize={"sm"}>{userProfile.last_sign_in_at}</Text>
          </VStack>
        </VStack>
      </HStack>
    </>
  );
}
