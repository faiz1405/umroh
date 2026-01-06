import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/public/home.tsx"),
  route("about", "routes/public/about.tsx"),
  route("layanan", "routes/public/services.tsx"),
  route("blog", "routes/public/blog-list.tsx"),
  route("blog/:slug", "routes/public/blog-detail.tsx"),
  route("contact", "routes/public/contact.tsx"),
  
  // Auth route
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  
  // Admin routes (protected)
  route("admin", "routes/admin-layout.tsx", [
    index("routes/admin/dashboard.tsx"),
    route("config", "routes/admin/config.tsx"),
    route("services", "routes/admin/services.tsx"),
    route("posts", "routes/admin/posts.tsx"),
    route("inbox", "routes/admin/inbox.tsx"),
  ]),
] satisfies RouteConfig;
