/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Allows production builds to succeed even if there are minor type issues
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to succeed even if there are lint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
