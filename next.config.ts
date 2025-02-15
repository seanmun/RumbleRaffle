/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: ".next",  // 🔥 Ensures Next.js uses the default build folder
  experimental: {
    appDir: false,   // 🔥 Forces Pages Router mode (prevents build deletion)
  },
  generateBuildId: async () => {
    return "my-build"; // 🔥 Ensures a fresh build every time
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 🔥 Keeps routes active longer
    pagesBufferLength: 5,
  },
};

export default nextConfig;
