/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'loremflickr.com'],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Redirects wurden entfernt
};

module.exports = nextConfig;
