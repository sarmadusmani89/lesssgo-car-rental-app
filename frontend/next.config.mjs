/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,           // Recommended for catching potential bugs
  swcMinify: true,                 // Use Next.js SWC compiler for faster builds
  output: 'standalone',            // Enable standalone output for Docker
  experimental: {
    appDir: true,                  // Enable the app directory if using App Router
  },
  images: {
    domains: ['localhost', 'yourdomain.com'], // Add domains for <Image> optimization
  },
  env: {
    // Add your environment variables here
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
};

export default nextConfig;
