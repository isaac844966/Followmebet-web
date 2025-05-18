/** @type {import('next').NextConfig} */


const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: "https://staging.apifmb.org/api/:path*", 
      },
    ];
  },
};

export default nextConfig
