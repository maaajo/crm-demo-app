import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
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

  useEffect(() => {
    const getProfileDetails = async (userId: string, emailAddress?: string) => {
      const { avatarUri } = await getProfileAvatarUri(supabaseClient, userId);

      if (avatarUri) {
        setUserProfile(() => ({
          avatarUri,
          isLoading,
          userId,
          emailAddress,
        }));
      }
    };

    if (!isLoading && session) {
      getProfileDetails(session.user.id, session.user.email);
    }
  }, [isLoading, session, supabaseClient]);

  const value = { userProfile, setUserProfile };

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
