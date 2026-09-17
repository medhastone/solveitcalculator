/* eslint-disable @next/next/no-page-custom-font */
import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import ScrollNavigation from '@/components/ScrollNavigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://solveitcalculator.com'),
  title: 'SolveIt Calculator',
  description: 'Every Calculation. One Place.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        </noscript>
      </head>
            <body className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen transition-colors duration-150" suppressHydrationWarning>
        <Script id="material-symbols-loader" strategy="beforeInteractive">
          {`
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
            document.head.appendChild(l);
          `}
        </Script>

        <Script id="error-boundary-shield" strategy="beforeInteractive">
          {`
            (function() {
              try {
                if (typeof window !== 'undefined') {
                  window.addEventListener('error', function(event) {
                    // Suppress resource-level load errors (e.g., GTM, external analytics blocked by adblock)
                    if (event && event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK' || event.target.tagName === 'IMG')) {
                      if (event.stopPropagation) event.stopPropagation();
                      return;
                    }
                  }, true);
                  window.addEventListener('unhandledrejection', function(event) {
                    if (event && !event.reason) {
                      if (event.preventDefault) event.preventDefault();
                    }
                  });
                }
              } catch(e) {}
            })();
          `}
        </Script>
        <Script id="gtm-script" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){
              try {
                w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
                j.onerror=function(){};
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                if(f && f.parentNode) { f.parentNode.insertBefore(j,f); }
              } catch(e) {}
            })(window,document,'script','dataLayer','GTM-59XVBNKN');
          `}
        </Script>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
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
          `}
        </Script>
        <Script id="json-stringify-fix" strategy="beforeInteractive">
          {`
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
          `}
        </Script>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-59XVBNKN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Header />
        
        {children}
        <Footer />
        <ScrollNavigation />
      </body>
    </html>
  );
}
