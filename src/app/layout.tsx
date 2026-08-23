import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolShell from '@/components/layout/ToolShell';
import AdSlot from '@/components/ui/AdSlot';
import { SITE_CONFIG } from '@/lib/siteConfig';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'VEYLO — Free tools for EVERYTHING',
    template: '%s | VEYLO',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'online tools',
    'free browser tools',
    'mouse tester',
    'mouse test online',
    'double click test',
    'mouse polling rate test',
    'mouse DPI test',
    'CPS test',
    'hardware diagnostics',
    'browser utilities',
    'VEYLO',
  ],
  authors: [{ name: SITE_CONFIG.publisher }],
  creator: SITE_CONFIG.publisher,
  publisher: SITE_CONFIG.publisher,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'VEYLO — Free tools for EVERYTHING',
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEYLO — Free tools for EVERYTHING',
    description: SITE_CONFIG.description,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_CONFIG.name,
  alternateName: 'VEYLO Tools',
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  publisher: {
    '@type': 'Organization',
    name: SITE_CONFIG.publisher,
    url: SITE_CONFIG.url,
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-3 py-1.5 text-sm rounded-md z-[100]"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          <ToolShell>
            {children}
          </ToolShell>
        </main>
        <Footer />

        {/* AdSense readiness bottom container */}
        <AdSlot position="bottom-banner" />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

