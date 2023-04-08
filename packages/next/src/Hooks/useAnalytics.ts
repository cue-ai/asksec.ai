import { useEffect } from "react";
import { analyticsBrowser, initAnalytics } from "@/Lib/analyticsBrowser";
import Router from "next/router";

export const useAnalytics = () => {
  useEffect(() => {
    if (!window) return;
    initAnalytics();
    analyticsBrowser.page(window.location.pathname);
    const handleRouteChange = (url: string) => {
      requestAnimationFrame(() => analyticsBrowser.page(url));
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => Router.events.off("routeChangeComplete", handleRouteChange);
  }, []);
};
