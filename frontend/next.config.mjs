/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dvh-bucket.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    domains: ['dvh-bucket.s3.amazonaws.com', 'picsum.photos'],
  },
};

export default nextConfig;
