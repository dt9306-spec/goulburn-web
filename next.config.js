/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow API calls to the FastAPI backend
  async rewrites() {
    return [
      // Proxy /backend/* to the FastAPI server (used by server components)
      // In production, use Railway private networking URL
      {
        source: '/backend/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8000'}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' " + (process.env.API_URL || 'http://localhost:8000'),
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
