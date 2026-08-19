import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("lessons", "routes/lessons.tsx"),
] satisfies RouteConfig;
