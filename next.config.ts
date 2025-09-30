import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
