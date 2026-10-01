import type { MetaDescriptor } from "react-router";

export const SITE_NAME = "Trumpo";

const SITE_URL = "https://trumpo-57216.web.app";
const SOCIAL_IMAGE_URL = `${SITE_URL}/trumpo-social.png`;
const SOCIAL_IMAGE_ALT =
  "Trumpo social preview with a gold trumpet and the words Learn the trumpet online";

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

export function pageMeta({
  title,
  description,
  path,
  noindex = false,
}: PageMetaOptions): MetaDescriptor[] {
  const url = new URL(path, `${SITE_URL}/`).toString();

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: SOCIAL_IMAGE_URL },
    { property: "og:image:secure_url", content: SOCIAL_IMAGE_URL },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1733" },
    { property: "og:image:height", content: "908" },
    { property: "og:image:alt", content: SOCIAL_IMAGE_ALT },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: SOCIAL_IMAGE_URL },
    { name: "twitter:image:alt", content: SOCIAL_IMAGE_ALT },
    ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
  ];
}
