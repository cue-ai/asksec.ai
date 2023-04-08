// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { FC } from "react";
import { theme } from "@/Theme";
import { QueryParamProvider } from "use-query-params";
import { NextAdapter } from "next-query-params";
import { SWRConfig } from "swr";
import { useAnalytics } from "@/Hooks/useAnalytics";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useAnalytics();

  return (
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
};

export default App;
