/** @type {import('next').NextConfig} */
const nextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/blog",
  //       permanent: true, // Set to true for a 308 permanent redirect
  //     },
  //   ];
  // },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '99notes-test.s3.eu-north-1.amazonaws.com',
        pathname: '/**', // Allow all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/**', // Allow all paths under this hostname
      },
      {
        protocol: 'https',
        hostname: 'www.psdstack.com',
        pathname: '/**', // Allow all paths for placeholder images
      },
    ],
  },
};

module.exports = nextConfig;
