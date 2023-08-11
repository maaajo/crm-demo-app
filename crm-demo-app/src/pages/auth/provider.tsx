import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AuthLayout from "../auth-layout";

const ProviderAuthRedirect: NextPageWithLayout = () => {
  const router = useRouter();
  // should have bool type
  const { refresh } = router.query;
  // error should show error toast
  const { isLoading, session, error } = useSessionContext();

  useEffect(() => {
    if (!isLoading && session) {
      void router.push("/");
    }
  }, [isLoading, session]);

  //change this to have better ui with spinner
  return <p>Redirecting...</p>;
};

ProviderAuthRedirect.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ProviderAuthRedirect;
