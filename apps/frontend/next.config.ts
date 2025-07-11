import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: isDev
      ? [
          {
            protocol: "https",
            hostname: "**.devtunnels.ms",
          },
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
          },
        ]
      : [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
          },
          {
            protocol: "https",
            hostname: "api.premiumstays.com", // backend real
            pathname: "/uploads/**",
          },
        ],
  },
};

export default nextConfig;
