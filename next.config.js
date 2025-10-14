/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  // App directory is stable in Next.js 14, no experimental flag needed
  images: {
    unoptimized: true
  },
  // Ensure all pages are included in static export
  trailingSlash: true,
  // Skip build-time errors for dynamic routes
  skipTrailingSlashRedirect: true,
  // SEO optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Headers for better SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
