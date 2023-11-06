import { Database } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetStaticProps } from "next";
import { SupabaseClient } from "@/lib/supabase";

type ProfilePageProps = {
  email: string;
  createdAt: string;
  avatarURI: string;
};

export default function ProfilePage() {
  return <div>Profile</div>;
}

export const getStaticProps = (async (ctx) => {
  const { instance: supabase } = SupabaseClient;
  const test = await supabase.auth.getSession();

  console.log(test);

  return {
    props: {
      email: "",
      avatarURI: "",
      createdAt: "",
    },
  };
}) satisfies GetStaticProps<ProfilePageProps>;
