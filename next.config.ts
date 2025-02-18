/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false, // Ensures correct asset loading
  images: {
    unoptimized: true, // Ensures images load properly (avoids Next.js optimizations failing)
  },
  experimental: {
    appDir: false, // Fixes potential build issues
  },
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "", // Ensures assets are correctly referenced
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // ✅ Forces Next.js to load the env variable
  },
};

export default nextConfig;
