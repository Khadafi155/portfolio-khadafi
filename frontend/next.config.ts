import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained production server (.next/standalone/server.js)
  // so the Docker image runs without installing node_modules. Needed for the
  // VPS deploy behind Traefik.
  output: "standalone",
  // Pin file-tracing to this app (monorepo has a sibling backend/) so the
  // standalone trace stays correct.
  outputFileTracingRoot: __dirname,
  // Hide the Next.js dev indicator ("N" badge, bottom-left corner).
  devIndicators: false,
  // Pin the workspace root to this app so Next does not pick up a stray
  // lockfile elsewhere on the machine when inferring the root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
