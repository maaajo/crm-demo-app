import {
  RedirectCheckType,
  checkPossibleRedirect,
  getServerSideAuthUserEmail,
} from "@/lib/auth/methods";
import { TAccountSupabase } from "@/lib/types/account";
import { Database } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

type PageProps = {
  account: TAccountSupabase | null;
};

type QueryParams = ParsedUrlQuery & {
  id: string;
};

export default function AccountEdit({ account }: PageProps) {
  return <div>{account?.name}</div>;
}

export const getServerSideProps: GetServerSideProps<
  PageProps & { userEmail: string }
> = async (ctx) => {
  const query = ctx.query as QueryParams;
  const supabase = createServerSupabaseClient<Database>(ctx);
  const redirectPage = await checkPossibleRedirect(
    supabase,
    RedirectCheckType.Main
  );

  if (redirectPage) {
    return {
      redirect: {
        destination: redirectPage,
        permanent: false,
      },
    };
  }

  const userEmail = await getServerSideAuthUserEmail(supabase);

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", query.id);

  const account = data ? data[0] : null;

  return {
    props: { userEmail, account },
  };
};
