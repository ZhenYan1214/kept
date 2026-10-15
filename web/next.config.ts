import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // snarkjs spawns worker threads; bundling it into the server build breaks proof generation.
  serverExternalPackages: ["@semaphore-protocol/core", "@semaphore-protocol/proof", "snarkjs", "ffjavascript", "web-worker"],
};

export default nextConfig;
