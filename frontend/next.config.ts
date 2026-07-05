import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev indicator ("N" badge, bottom-left corner).
  devIndicators: false,
  // Pin the workspace root to this app so Next does not pick up a stray
  // lockfile elsewhere on the machine when inferring the root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
