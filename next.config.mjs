/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Combine all image settings into one object
    unoptimized: true,
    domains: [
      'cdn.fourthwall.com', // Your actual Fourthwall image CDN
      'via.placeholder.com', // <--- IMPORTANT: Add this for the placeholder image
      // Add any other specific image domains you found by inspecting your Fourthwall product images
    ],
  },
}

export default nextConfig