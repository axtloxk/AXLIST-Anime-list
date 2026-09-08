import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./lib/generated/prisma/**/*"],
  },

  allowedDevOrigins: ["192.168.244.13"],

  images: {
    qualities: [75, 85],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
      {
        protocol: "https",
        hostname: "*.anilist.co",
      },
      {
        protocol: "https",
        hostname: "shikimori.io",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
