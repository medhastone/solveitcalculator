/* eslint-disable @next/next/no-page-custom-font */
import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'SolveIt Calculator',
  description: 'Every Calculation. One Place.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'SolveIt Calculator',
    description: 'Every Calculation. One Place.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolveIt Calculator',
    description: 'Every Calculation. One Place.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('solveit_theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var orig = JSON.stringify;
                  JSON.stringify = function(val, replacer, space) {
                    var seen = new WeakSet();
                    var customReplacer = function(key, v) {
                      if (typeof v === 'object' && v !== null) {
                        if (typeof Node !== 'undefined' && v instanceof Node) {
                          return '[DOM ' + (v.nodeName || 'Element') + ']';
                        }
                        if (seen.has(v)) {
                          return '[Circular]';
                        }
                        seen.add(v);
                      }
                      if (typeof replacer === 'function') {
                        return replacer.call(this, key, v);
                      }
                      return v;
                    };
                    if (Array.isArray(replacer)) {
                      return orig.call(this, val, replacer, space);
                    }
                    return orig.call(this, val, customReplacer, space);
                  };
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen transition-colors duration-150" suppressHydrationWarning>{children}</body>
    </html>
  );
}
