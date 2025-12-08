import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org', 
        pathname: '/**',
      },
      { protocol: 'http', hostname: 'books.google.com' }, 
      { protocol: 'https', hostname: 'books.google.com' },
    ],
  },
};

export default nextConfig;