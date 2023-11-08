import { Database } from "@/lib/types/supabase";
import { getAvatar } from "@/lib/utils";
import { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfileSupabase } from "@/lib/types/supabase";

export const addAvatar = async (
  supabaseClient: SupabaseClient<Database>,
  userId: string
) => {
  if (!userId) {
    throw new Error("Missing user id");
  }

  await supabaseClient
    .from("profile")
    .update({ avatar_uri: getAvatar() })
    .eq("id", userId)
    .is("avatar_uri", null);
};

export const getUserProfile = async (
  supabaseClient: SupabaseClient<Database>,
  userId: string
) => {
  if (!userId) {
    throw new Error("Missing user id");
  }

  const { data, error } = await supabaseClient
    .from("profile")
    .select("avatar_uri, email, last_sign_in_at, created_at")
    .eq("id", userId);

  let returnData: UserProfileSupabase | null = null;

  if (data) {
    if (data.length > 0) {
      returnData = data[0];
    }
  }

  return {
    returnData,
    error,
  };
};
