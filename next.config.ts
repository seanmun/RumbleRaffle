/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: true, // Ensures correct asset loading
  images: {
    unoptimized: true, // Ensures images load properly (avoids Next.js optimizations failing)
  },
  experimental: {
    appDir: false, // Fixes potential build issues
  },
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "", // Ensures assets are correctly referenced
};

export default nextConfig;
