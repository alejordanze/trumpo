import type { Config } from "@react-router/dev/config";

export default {
  // Trumpo has no request-time server data, so generate every static route at
  // build time and deploy only build/client to Firebase Hosting.
  ssr: false,
  prerender: true,
} satisfies Config;
