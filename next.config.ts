import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
    viewTransition: true,
  },
};

export default nextConfig;
