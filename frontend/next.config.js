const fs = require('fs');
const path = require('path');

// Function to check if certificate files exist
const checkCertificates = () => {
  const certPath = path.join(__dirname, 'localhost.pem');
  const keyPath = path.join(__dirname, 'localhost-key.pem');
  
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.error('SSL certificates not found. Please run mkcert localhost in the frontend directory.');
    process.exit(1);
  }
};

// Check certificates before starting
checkCertificates();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://localhost:8000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Configure WebSocket to use secure connection
  async rewrites() {
    return [
      {
        source: '/ws/:path*',
        destination: 'https://localhost:8000/ws/:path*',
      },
    ];
  },
}

module.exports = nextConfig; 