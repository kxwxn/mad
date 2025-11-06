import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ukcglqjdaqefddgqvmqf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  output: 'standalone',
  
  // 보안 헤더 추가
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://js.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev",
              "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.dev",
              "img-src 'self' data: blob: https://ukcglqjdaqefddgqvmqf.supabase.co https://fzjfpmdz7ksfsins.public.blob.vercel-storage.com https://*.clerk.accounts.dev https://*.clerk.dev",
              "font-src 'self' data:",
              "connect-src 'self' https://ukcglqjdaqefddgqvmqf.supabase.co https://vercel.live https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev",
              "media-src 'self' blob: https://fzjfpmdz7ksfsins.public.blob.vercel-storage.com",
              "frame-src 'self' https://preview.mailerlite.io https://checkout.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);