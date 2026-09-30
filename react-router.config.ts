import type { Config } from "@react-router/dev/config";
import { LESSON_IDS } from "./app/lib/lessonIds";

export default {
  // Generate the course index and every reusable lesson URL at build time for
  // Firebase Hosting's static deployment.
  ssr: false,
  prerender: ({ getStaticPaths }) => [
    ...getStaticPaths(),
    "/lessons",
    ...Object.values(LESSON_IDS).map((id) => `/lessons/${id}`),
  ],
} satisfies Config;
