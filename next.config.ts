/* 
This Next.js configuration file sets up PWA (Progressive Web App) and bundle analysis capabilities. Here's what each part does:
Environment & Plugins:
isProd - Checks if running in production mode
withBundleAnalyzer - Enables bundle size analysis when ANALYZE=true environment variable is set
withPWA - Configures PWA functionality with service worker registration in the public folder
Next.js Config:
compress: isProd - Enables gzip compression only in production
reactStrictMode: true - Enables React's strict mode for better error detection
typescript.ignoreBuildErrors: true - Allows builds to complete even with TypeScript errors (not recommended for production)
images.remotePatterns - Allows loading images from utfs.io domain (likely UploadThing CDN)
Webpack Customization:
asyncWebAssembly: true - Enables WebAssembly support
layers: true - Enables webpack layers feature
Module rule for .m?js files - Fixes compatibility issues with ES modules, specifically for the shikiji library (syntax highlighter)
Export:
In production: applies both PWA and bundle analyzer wrappers
In development: uses plain config (no PWA/analyzer overhead)
This setup optimizes for production builds while keeping development fast and enables PWA features like offline support and installability.
 */


import withPWAInit from "@ducanh2912/next-pwa";
import analyzer from '@next/bundle-analyzer';
const isProd = process.env.NODE_ENV === 'production';


const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  compress: isProd,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      } as const,
    ],
  }

};

export default isProd ? withBundleAnalyzer(withPWA(nextConfig)) : nextConfig