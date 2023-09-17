import { FC } from "react";
import Head from "next/head";
import { App } from "@/types";

interface Props {
  app: App;
}

const DocumentHead: FC<Props> = ({ app }: Props) => {
  const title = app?.title ?? "Insert Title Here",
    description = app?.description ?? "Insert Description Here",
    image = app?.image ?? "";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={app.favicon} />
      <link rel="manifest" href="/manifest/manifest.json" />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_BASE_URL}${app?.path}`}
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:site_name"
        content={process.env.NEXT_PUBLIC_SITE_NAME}
      />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${image}`} />

      {/* <!-- Twitter --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={process.env.NEXT_PUBLIC_TWITTER} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${image}`} />
    </Head>
  );
};

export default DocumentHead;
