import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
 images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/api/files/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
