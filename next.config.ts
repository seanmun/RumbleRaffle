import type { NextConfig } from "next";
import type { Configuration } from "webpack";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("express", "cors"); // ✅ Prevents backend dependencies from breaking frontend build
    }
    return config;
  },
};

export default nextConfig;
