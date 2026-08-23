import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
    default: 'Mouse Tester — Free Online Mouse & Hardware Utilities',
    template: '%s | Mouse Tester',
  },
  description: SITE_CONFIG.description,
  keywords: [
    'mouse tester',
    'mouse test',
    'mouse button test',
    'double click test',
    'mouse scroll test',
    'mouse polling rate test',
    'mouse DPI test',
    'CPS test',
    'online input tester',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
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
    title: 'Mouse Tester — Free Online Mouse & Hardware Utilities',
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Tester — Free Online Mouse & Hardware Utilities',
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-3 py-1.5 text-sm rounded-md z-[100]"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Skip to content
        </a>
        <Header />
        <ToolShell>
          {children}
        </ToolShell>
        <Footer />

        {/* AdSense readiness bottom container */}
        <AdSlot position="bottom-banner" />
      </body>
    </html>
  );
}
