import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Port configuration
    PORT: process.env.PORT || "3002",
    DEV_PORT: process.env.DEV_PORT || "3002",
    STAGING_PORT: process.env.STAGING_PORT || "3002",
    PRODUCTION_PORT: process.env.PRODUCTION_PORT || "3000",
  },

  // Custom server configuration
  experimental: {
    // Enable experimental features if needed
  },

  // Rewrites for API routes if needed
  async rewrites() {
    return [
      // Add any custom rewrites here
    ];
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
