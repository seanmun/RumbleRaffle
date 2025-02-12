/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enables static export mode
  distDir: "docs",  // Forces the build to go into /docs (for GitHub Pages)
  images: {
    unoptimized: true, // Fixes image issues with GitHub Pages
  },
};

module.exports = nextConfig;
