import { getServerSideAuthUserEmail } from "@/lib/auth/methods";
import { GetServerSideProps } from "next";

export default function AccountsHome() {
  return <div>Accounts</div>;
}

export const getServerSideProps: GetServerSideProps<{
  userEmail: string;
}> = async (ctx) => {
  const userEmail = await getServerSideAuthUserEmail(ctx);

  return {
    props: { userEmail },
  };
};
