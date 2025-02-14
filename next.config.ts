/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "docs",   // Ensures build goes into /docs
  images: {
    unoptimized: true,  // Fixes image loading issues
  },
  basePath: "",  // Remove this if using a custom domain (e.g., rumbleraffle.com)
  trailingSlash: true,  // Forces Next.js to generate static HTML for all routes
};

module.exports = nextConfig;
