import type {NextConfig} from 'next';

const isStaticExport = process.env.GITHUB_PAGES === 'true' || process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder and support static export on GitHub Pages.
  images: {
    unoptimized: isStaticExport ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: isStaticExport ? 'export' : 'standalone',
  trailingSlash: isStaticExport ? true : false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  transpilePackages: ['motion'],
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return [
            {
              source: '/volume',
              destination: '/volume-converter',
              permanent: true,
            },
            {
              source: '/capacity',
              destination: '/volume-converter',
              permanent: true,
            },
            {
              source: '/volume-and-capacity',
              destination: '/volume-and-capacity-converter',
              permanent: true,
            },
            {
              source: '/health-fitness',
              destination: '/health',
              permanent: false,
            },
            {
              source: '/bmi',
              destination: '/health/bmi',
              permanent: true,
            },
            {
              source: '/bmi-tool',
              destination: '/health/bmi',
              permanent: true,
            },
            {
              source: '/body-mass-index',
              destination: '/health/bmi',
              permanent: true,
            },
          ];
        },
      }),
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
