/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Proxy ALL /api/* calls to your backend automatically
  async rewrites() {
    return [      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Your NestJS backend
      },
    ];
  },
};

module.exports = nextConfig;