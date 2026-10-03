import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://solveitcalculator.com'),
  title: {
    default: 'SolveIt Calculator | Professional Free Online Calculators & Converters',
    template: '%s | SolveIt Calculator',
  },
  description:
    'Every Calculation. One Place. High-precision computational engines for finance, business, engineering, conversions, health, math, and daily productivity. 100% free, private, client-side execution.',
  openGraph: {
    title: 'SolveIt Calculator | Professional Free Online Calculators & Converters',
    description:
      'Every Calculation. One Place. High-precision computational engines for finance, business, engineering, conversions, health, math, and daily productivity.',
    url: 'https://solveitcalculator.com/',
    siteName: 'SolveItCalculator',
    images: [
      {
        url: '/solveit-1.webp',
        alt: 'SolveIt Calculator Logo',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/solveit-1.webp', type: 'image/webp' },
    ],
    shortcut: '/solveit-1.webp',
    apple: [
      { url: '/solveit-1.webp', type: 'image/webp' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/solveit-1.webp" type="image/webp" />
        <link rel="shortcut icon" href="/solveit-1.webp" />
        <link rel="apple-touch-icon" href="/solveit-1.webp" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('solveit_theme');
                  var theme = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'SolveIt Calculator',
                url: 'https://solveitcalculator.com',
                logo: 'https://solveitcalculator.com/solveit-1.webp',
                description:
                  'Free high-precision computational engines and converters for personal finance, mathematical formulas, physical conversions, health benchmarks, and daily productivity.',
                sameAs: [],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'SolveIt Calculator',
                url: 'https://solveitcalculator.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://solveitcalculator.com/?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="antialiased bg-surface text-on-surface min-h-screen transition-colors duration-200">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
