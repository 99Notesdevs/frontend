const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ias.99notes.in",
        pathname: "/**", // Allow all paths under this hostname
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/**", // Allow all paths under this hostname
      },
      {
        protocol: "https",
        hostname: "www.psdstack.com",
        pathname: "/**", // Allow all paths for placeholder images
      },
      {
        protocol: "https",
        hostname: "notesstorage99.blob.core.windows.net",
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig)
