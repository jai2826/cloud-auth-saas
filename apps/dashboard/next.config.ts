import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  async redirects() {
    return [
      {
        source: "/organization/:path*",
        destination: "/project/:path*",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
