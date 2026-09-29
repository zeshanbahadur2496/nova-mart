import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/prime", destination: "/search", permanent: true },
      { source: "/dashboard/prime", destination: "/dashboard/profile", permanent: true }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com"
      }
    ]
  }
};

export default nextConfig;
