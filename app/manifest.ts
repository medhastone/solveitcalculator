import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SolveItCalculator — Verified Formulas & Online Calculators',
    short_name: 'SolveItCalculator',
    description:
      'Free, fast online calculators with step-by-step formulas and reference tables across Math, Finance & Salary Tax, Home & Construction, Conversions, Health, and Science.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F7FA',
    theme_color: '#2457D6',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
