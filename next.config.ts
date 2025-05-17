import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "directus.snyamson.com",
      },
      {
        protocol: "https",
        hostname: "aceternity.com",
      },
    ],
  },
};

export default nextConfig;
