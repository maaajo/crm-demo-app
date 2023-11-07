import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getProfileAvatarUri } from "../db/utils/profile/methods";

type UserProfile = {
  avatarUri?: string;
  isLoading: boolean;
  emailAddress?: string;
  userId?: string;
};

type UserProfileContextProps = {
  userProfile: UserProfile;
  setUserProfile: Dispatch<SetStateAction<UserProfile>>;
  setIsUserProfileUpdated: Dispatch<SetStateAction<boolean>>;
};

type UserProfileContextProviderProps = {
  children: ReactNode;
};

const UserProfileContext = createContext<UserProfileContextProps | undefined>(
  undefined
);

function UserProfileProvider({ children }: UserProfileContextProviderProps) {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
    isLoading,
  }));
  const [isUserProfileUpdated, setIsUserProfileUpdated] = useState(false);

  useEffect(() => {
    const getProfileDetails = async (userId: string, emailAddress?: string) => {
      const { avatarUri } = await getProfileAvatarUri(supabaseClient, userId);

      setUserProfile(() => ({
        avatarUri: avatarUri ? avatarUri : undefined,
        isLoading,
        userId,
        emailAddress,
      }));
    };

    if (!isLoading && session) {
      console.log("effect runs");
      getProfileDetails(session.user.id, session.user.email);
    }
  }, [isLoading, session, supabaseClient, isUserProfileUpdated]);

  const value = { userProfile, setUserProfile, setIsUserProfileUpdated };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

function useUserProfileContext() {
  const context = useContext(UserProfileContext);

  if (context === undefined) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }

  return context;
}

export { UserProfileProvider, useUserProfileContext };
