import './env.mjs';

/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';
import million from 'million/compiler';

const millionConfig = {
  auto: true,
  // if you're using RSC:
  // auto: { rsc: true },
};

const runWithBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
];

const nextConfig = runWithBundleAnalyzer({
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'globalThis.__DEV__': false,
      }),
    );
    return config;
  },
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error'],
          }
        : false,
  },
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  poweredByHeader: false,

  images: {
    domains: [],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/overview',
        permanent: true,
      },
    ];
  },
});

export default process.env.NODE_ENV === 'production'
  ? million.next(nextConfig, millionConfig)
  : nextConfig;
