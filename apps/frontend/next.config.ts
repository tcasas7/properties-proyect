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
        ]
      : [
          {
            protocol: "https",
            hostname: "api.premiumstays.com", //dominio real
            pathname: "/uploads/**",
          },
        ],
  },
};

export default nextConfig;
