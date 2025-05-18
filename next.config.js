/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'loremflickr.com', 'localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Bei Verwendung beider App- und Pages-Router
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;