import { Database } from "@/lib/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export const getProfileAvatarUri = async (
  supabaseClient: SupabaseClient<Database>,
  userId: string
) => {
  if (!userId) {
    throw new Error("Missing user id");
  }

  let avatarUri: string | null = null;

  const { data, error } = await supabaseClient
    .from("profile")
    .select("avatar_uri")
    .eq("id", userId);

  if (data) {
    if (data.length > 0) {
      avatarUri = data[0].avatar_uri;
    }
  }

  return {
    avatarUri,
    error,
  };
};
