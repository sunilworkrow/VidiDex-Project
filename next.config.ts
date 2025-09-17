import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this to completely skip linting
  experimental: {
    eslint: {
      ignoreDuringBuilds: true,
    },
  },
};

export default nextConfig;