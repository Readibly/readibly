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
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = process.env.BACKEND_URL || 'https://localhost:8000';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: backendUrl,
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
  // Configure WebSocket based on environment
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = process.env.BACKEND_URL || 'https://localhost:8000';
    
    return [
      {
        source: '/ws/:path*',
        destination: `${backendUrl}/ws/:path*`,
      },
    ];
  },
}

module.exports = nextConfig; 