import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
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
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
};

export default nextConfig;
