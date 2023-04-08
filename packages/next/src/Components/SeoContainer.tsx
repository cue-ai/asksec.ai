import React from "react";
import Head from "next/head";

type SeoContainerProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  children: React.ReactNode;
};

export const SeoContainer: React.FC<SeoContainerProps> = ({
  title = "AskSEC.ai",
  description = "Search SEC filings for anything in a click.",
  imageUrl = "https://i.imgur.com/sirsDQ4.png",
  children,
}) => (
  <main>
    <Head>
      <meta charSet="utf-8" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Head>
    {children}
  </main>
);
