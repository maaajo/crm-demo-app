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
import { getUserProfile } from "../db/utils/profile/methods";
import { UserProfileSupabase } from "../types/supabase";

type UserProfile = UserProfileSupabase & {
  is_loading: boolean;
  user_id: string | null;
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
    is_loading: isLoading,
    user_id: null,
    avatar_uri: null,
    created_at: "",
    email: "",
    last_sign_in_at: null,
  }));
  const [isUserProfileUpdated, setIsUserProfileUpdated] = useState(false);

  useEffect(() => {
    const getProfileDetails = async (userId: string) => {
      const { returnData } = await getUserProfile(supabaseClient, userId);

      if (returnData) {
        setUserProfile(() => ({
          is_loading: isLoading,
          user_id: userId,
          ...returnData,
        }));
      }
    };

    if (!isLoading && session) {
      getProfileDetails(session.user.id);
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
