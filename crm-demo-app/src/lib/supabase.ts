import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./types/supabase";

const SupabaseClient = {
  instance: createBrowserSupabaseClient<Database>(),
};

export type SupabaseClientType = typeof SupabaseClient;

Object.freeze(SupabaseClient);

export { SupabaseClient };
