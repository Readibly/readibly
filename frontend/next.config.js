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
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
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
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https: 'unsafe-inline' 'unsafe-eval' https://webgazer.cs.brown.edu; media-src 'self' https:; connect-src 'self' wss: ws: https:;"
          }
        ],
      },
    ];
  },
}

module.exports = nextConfig; 