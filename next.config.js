/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'loremflickr.com'],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/destinations',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
