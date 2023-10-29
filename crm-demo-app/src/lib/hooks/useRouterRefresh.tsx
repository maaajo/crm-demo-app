import { useRouter } from "next/router";
import { useCallback } from "react";

export default function useRouterRefresh() {
  const router = useRouter();
  const { asPath } = router;

  const refreshServerSideProps = useCallback(() => {
    router.replace(asPath);
  }, [router, asPath]);

  return { refreshServerSideProps };
}
