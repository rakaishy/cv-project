import type { NextConfig } from "next";

/**
 * GitHub Pages only serves static files, so the Pages build runs with
 * `STATIC_EXPORT=true`. That build also drops the `/api/chat` route handler
 * (Pages can't run server code), which is why the chat UI is switched off
 * there with `NEXT_PUBLIC_CHAT_ENABLED=false`.
 *
 * A project site is served from https://<user>.github.io/<repo>/, so
 * `NEXT_PUBLIC_BASE_PATH` must match or every `_next/*` asset 404s.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      ...(basePath ? { basePath } : {}),
    }
  : {};

export default nextConfig;
