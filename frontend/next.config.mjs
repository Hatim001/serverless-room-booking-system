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
        port: '',
      },
    ],
  },
};

export default nextConfig;
