/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.the-body-healer.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
