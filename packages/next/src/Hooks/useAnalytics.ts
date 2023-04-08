import { useEffect } from "react";
import { analytics, initAnalytics } from "@/Lib/analytics";
import Router from "next/router";

export const useAnalytics = () => {
  useEffect(() => {
    if (!window) return;
    initAnalytics();
    analytics.page(window.location.pathname);
    const handleRouteChange = (url: string) => {
      requestAnimationFrame(() => analytics.page(url));
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => Router.events.off("routeChangeComplete", handleRouteChange);
  }, []);
};
