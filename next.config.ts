import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,

  // Performance: Enable image optimization
  images: {
    unoptimized: false, // Re-enable Next.js image optimization for better performance
    formats: ['image/webp', 'image/avif'], // Modern formats for smaller file sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Performance: Enable production optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Performance: Optimize production builds
  productionBrowserSourceMaps: false, // Disable source maps in production for faster builds

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance: Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Performance: Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'], // Tree-shake icon library
  },
}

// Bundle analyzer - enable with ANALYZE=true npm run build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
