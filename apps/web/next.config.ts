import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@wellness/contracts"],
  experimental: {
    webpackMemoryOptimizations: true
  },
  poweredByHeader: false
};

export default nextConfig;
