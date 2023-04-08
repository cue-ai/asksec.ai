// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { FC } from "react";
import { theme } from "@/Theme";
import { QueryParamProvider } from "use-query-params";
import { NextAdapter } from "next-query-params";
import { SWRConfig } from "swr";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <QueryParamProvider adapter={NextAdapter}>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </QueryParamProvider>
  </ChakraProvider>
);

export default MyApp;
