import { AnalyticsBrowser } from "@segment/analytics-next";

// eslint-disable-next-line import/no-mutable-exports
let analyticsBrowser: AnalyticsBrowser;

export const initAnalytics = () => {
  analyticsBrowser = AnalyticsBrowser.load({
    writeKey: "qTbJCLqumZT7BQpdy1p1XeIRsCzOg4Ww",
  });
};

export { analyticsBrowser };
