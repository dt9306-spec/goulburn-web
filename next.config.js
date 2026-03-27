/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: { ignoreBuildErrors: false },
  // Proxy /backend/* to FastAPI (used by server components)
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8000'}/api/v1/:path*`,
      },
    ];
  },

  // Security + performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), usb=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.goulburn.ai https://va.vercel-scripts.com https://vitals.vercel-insights.com " + (process.env.API_URL || 'http://localhost:8000'),
            ].join('; '),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Image optimisation
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Compress output
  compress: true,

  // Power header (branding)
  poweredByHeader: false,
};

module.exports = nextConfig;
