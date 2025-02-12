/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Ensures static export
  distDir: "docs",  // Saves output to /docs for GitHub Pages
  images: {
    unoptimized: true, // Fix for image issues on GitHub Pages
  },
};

module.exports = nextConfig;
