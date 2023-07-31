import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import Layout from "./layout";
import { InputTheme } from "@/theme/inputTheme";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { SupabaseClient } from "@/lib/supabase";

const theme = extendTheme({
  variants: {
    secondary: (props: StyleFunctionProps) => ({
      ...props.theme.components.Button.variants.outline(props),
      color: "green.500",
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

export default function App({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => SupabaseClient.instance);

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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </SessionContextProvider>
    </>
  );
}
