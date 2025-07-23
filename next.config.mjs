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
    domains: ["cdn.fourthwall.com", "via.placeholder.com"],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Use default output for Cloudflare Pages compatibility
  swcMinify: true,
};

export default nextConfig;
