import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.psacard.com",
        pathname: "/s3/**",
      },
    ],
  },
};

export default nextConfig;
