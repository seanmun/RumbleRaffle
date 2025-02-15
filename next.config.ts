import type { NextConfig } from "next";
import type { Configuration, WebpackOptionsNormalized } from "webpack";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config: Configuration & { externals?: WebpackOptionsNormalized["externals"] }, { isServer }) => {
    if (isServer) {
      if (!Array.isArray(config.externals)) {
        config.externals = [];
      }
      (config.externals as unknown as string[]).push("express", "cors"); // ✅ Fully typed .push
    }
    return config;
  },
};

export default nextConfig;
