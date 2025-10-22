/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables are automatically included from .env files in Next.js
  // You don't need the env section unless adding runtime configs

  // Remove the experimental section that was causing issues
  // experimental: {
  //   serverComponentsExternalPackages: [],
  // },
};

export default nextConfig;