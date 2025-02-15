/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "docs",   // Ensures build goes into /docs
  images: {
    unoptimized: true,  // Fixes image loading issues
  },
  basePath: "",  // Keep empty since we're using a custom domain
  trailingSlash: true,  // Ensures proper routing
};

export default nextConfig;
