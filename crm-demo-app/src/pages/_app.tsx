import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import Layout from "../components/layout";
import { InputTheme } from "@/theme/inputTheme";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { SupabaseClient } from "@/lib/supabase";

const theme = extendTheme({
  // the below needs to be changed: https://codesandbox.io/s/extend-variants-demo-0nhtc?file=/src/theme/index.ts
  // variants: {
  //   secondary: (props: StyleFunctionProps) => ({
  //     ...props.theme.components.Button.variants.outline(props),
  //     color: "green.500",
  //   }),
  // },
  styles: {
    global: () => ({
      body: {
        background: "blackAlpha.300",
      },
    }),
  },
  fonts: {
    heading: "var(--font-inter)",
    body: "var(--font-inter)",
  },
  components: {
    Input: InputTheme,
  },
});

const inter = Inter({ subsets: ["latin"] });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<T = any> = AppProps<T> & {
  Component: NextPageWithLayout<T>;
};

export default function App({
  Component,
  pageProps,
}: AppPropsWithLayout<{ initialSession: Session; userEmail: string }>) {
  const [supabaseClient] = useState(() => SupabaseClient.instance);

  const getLayout = Component.getLayout;

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
          }
        `}
      </style>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ChakraProvider theme={theme}>
          {getLayout ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <Layout userEmail={pageProps.userEmail}>
              <Component {...pageProps} />
            </Layout>
          )}
        </ChakraProvider>
      </SessionContextProvider>
    </>
  );
}
