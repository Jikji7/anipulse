import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.anilist.co',
      },
      {
        protocol: 'https',
        hostname: '*.crunchyroll.com',
      },
      {
        protocol: 'https',
        hostname: '*.animenewsnetwork.com',
      },
      {
        protocol: 'https',
        hostname: '*.myanimelist.net',
      },
    ],
  },
};

export default nextConfig;
