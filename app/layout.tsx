import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://solveitcalculator.com'),
  title:
    'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts',
  description:
    'Free, fast online calculators with live step-by-step formulas and reference tables across Math, Finance & Salary Tax, Home & Construction, Unit & Recipe Conversion, Date & Time, Health, and Science.',
  manifest: '/manifest.webmanifest',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
