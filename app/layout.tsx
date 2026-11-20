import type { Metadata } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import './globals.css';
import AppShell from '@/components/AppShell';
import {
  buildCoreCalculatorJsonLd,
  getCoreCalculatorSeoByPath,
} from '@/lib/coreCalculatorSeoContent';

const plusJakarta = localFont({
  src: '../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '400 800',
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '400 700',
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://solveitcalculator.com'),
  title:
    'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
  description:
    'Free, fast online calculators with live step-by-step formulas and reference tables across Math, Finance & Salary Tax, Home & Construction, Unit & Recipe Conversion, Date & Time, Health, and Science.',
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '64x64' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
  },
  openGraph: {
    title:
      'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
    description:
      'Calculate percentages, construction materials, recipe conversions, country take-home salary, loans, mortgages, BMI, and more with 100% transparent formulas.',
    url: 'https://solveitcalculator.com',
    siteName: 'SolveItCalculator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
    description:
      'Calculate percentages, construction materials, recipe conversions, country take-home salary, loans, mortgages, BMI, and more with 100% transparent formulas.',
  },
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var root = document.documentElement;
    var savedTheme = localStorage.getItem('solveit_theme');
    var rawA11y = localStorage.getItem('solveit_a11y_prefs');
    var parsedA11y = rawA11y ? JSON.parse(rawA11y) : null;
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = false;

    if (savedTheme === 'dark') {
      isDark = true;
    } else if (savedTheme === 'light') {
      isDark = false;
    } else if (savedTheme === 'system') {
      isDark = systemDark;
    } else if (parsedA11y && (parsedA11y.displayMode === 'dark' || parsedA11y.displayMode === 'default')) {
      isDark = parsedA11y.displayMode === 'dark';
    } else {
      isDark = systemDark;
    }

    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.style.colorScheme = isDark ? 'dark' : 'light';

    if (parsedA11y) {
      if (parsedA11y.textSize) root.setAttribute('data-a11y-text-size', parsedA11y.textSize);
      if (typeof parsedA11y.reduceMotion === 'boolean') {
        root.setAttribute('data-a11y-reduce-motion', parsedA11y.reduceMotion ? 'true' : 'false');
      }
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let coreSchemaJson: string | null = null;
  const isStaticExport =
    process.env.GITHUB_PAGES === 'true' || process.env.STATIC_EXPORT === 'true';

  if (!isStaticExport) {
    try {
      const requestHeaders = await headers();
      const pathname = requestHeaders.get('x-pathname');
      const coreSeoEntry = getCoreCalculatorSeoByPath(pathname);
      if (coreSeoEntry) {
        coreSchemaJson = JSON.stringify(
          buildCoreCalculatorJsonLd(coreSeoEntry)
        );
      }
    } catch {
      coreSchemaJson = null;
    }
  }

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#F5F4F0" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        {coreSchemaJson && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: coreSchemaJson }}
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F5F7FA] text-[#152238] antialiased selection:bg-[#2457D6] selection:text-white"
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
