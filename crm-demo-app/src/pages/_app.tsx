import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import Layout from "../components/layout";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { SupabaseClient } from "@/lib/supabase";
import { AccountsProvider } from "@/lib/context/account";
import customTheme from "@/theme";

const inter = Inter({ subsets: ["latin"] });

// const theme = extendTheme({
//   styles: {
//     global: () => ({
//       body: {
//         background: "blackAlpha.300",
//       },
//     }),
//   },
//   fonts: {
//     heading: "var(--font-inter)",
//     body: "var(--font-inter)",
//   },
//   components: {
//     Input: InputTheme,
//     Checkbox: CheckboxTheme,
//     Button: ButtonTheme,
//   },
// });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<T = any> = AppProps<T> & {
  Component: NextPageWithLayout<T>;
};

export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout<{
  initialSession: Session;
  userEmail: string;
}>) {
  const [supabaseClient] = useState(() => SupabaseClient.instance);

  const getLayout = Component.getLayout;

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily}, "sans-serif";
          }
        `}
      </style>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ChakraProvider theme={customTheme}>
          <AccountsProvider>
            {getLayout ? (
              getLayout(<Component {...pageProps} />)
            ) : (
              <Layout userEmail={pageProps.userEmail}>
                <Component {...pageProps} />
              </Layout>
            )}
          </AccountsProvider>
        </ChakraProvider>
      </SessionContextProvider>
    </>
  );
}
