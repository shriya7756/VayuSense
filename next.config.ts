import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
