import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
      {
        protocol: 'https',
        hostname: 'placebear.com',
      },
      {
        protocol: 'https',
        hostname: 'placebeard.it',
      },
    ],
  },
};

export default nextConfig;
