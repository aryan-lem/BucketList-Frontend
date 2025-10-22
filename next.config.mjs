/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // This ensures environment variables are properly passed
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Add this to avoid errors with browser APIs during SSR
  experimental: {
    // This ensures proper client/server separation
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;