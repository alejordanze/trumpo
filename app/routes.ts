import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("lessons/:lessonId?", "routes/lessons.tsx"),
] satisfies RouteConfig;
