import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

const SupabaseClient = {
  instance: createBrowserSupabaseClient(),
};

export type SupabaseClientType = typeof SupabaseClient;

Object.freeze(SupabaseClient);

export { SupabaseClient };
