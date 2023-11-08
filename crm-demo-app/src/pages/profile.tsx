import { useUserProfileContext } from "@/lib/context/user-profile";

export default function ProfilePage() {
  const { userProfile } = useUserProfileContext();
  return <div>{JSON.stringify(userProfile)}</div>;
}
