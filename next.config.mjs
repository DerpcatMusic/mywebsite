/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Fix cross-origin warnings for development
  allowedDevOrigins: [
    '192.168.1.145',
    'localhost',
    '127.0.0.1',
  ],
  images: {
    // Combine all image settings into one object
    unoptimized: true,
    domains: [
      "cdn.fourthwall.com", // Your actual Fourthwall image CDN
      "via.placeholder.com", // <--- IMPORTANT: Add this for the placeholder image
      "logos.brand.dev", // Brand.dev logo CDN
      "brand-logos.s3.amazonaws.com", // Brand.dev S3 bucket
      "logo.clearbit.com", // Clearbit logos (sometimes used by brand.dev)
      // Add any other specific image domains you found by inspecting your Fourthwall product images
    ],
  },
};

export default nextConfig;
