import { AnalyticsBrowser } from "@segment/analytics-next";

// eslint-disable-next-line import/no-mutable-exports
let analytics: AnalyticsBrowser;

export const initAnalytics = () => {
  analytics = AnalyticsBrowser.load({
    writeKey: "qTbJCLqumZT7BQpdy1p1XeIRsCzOg4Ww",
  });
};

export { analytics };
