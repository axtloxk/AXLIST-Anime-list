import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.244.13"],
  // adding images protoc...
  images: {
    qualities: [75, 85],
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      {
        protocol: "https",
        hostname: "*.anilist.co",
      },
    ],
  },
};

export default nextConfig;
