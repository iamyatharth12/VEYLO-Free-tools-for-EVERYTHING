import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header   from '@/components/layout/Header';
import Footer   from '@/components/layout/Footer';
import ToolShell from '@/components/layout/ToolShell';

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       'Mouse Tester — Free Browser Tools',
  description: 'Free, privacy-friendly browser utilities. Test your mouse, keyboard, gamepad, and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mousetester.app'),
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

        {/* Ad slot placeholders — hidden; structure ready for future monetization */}
        <div data-ad-slot="bottom-banner"  aria-hidden="true" style={{ display: 'none' }} />
      </body>
    </html>
  );
}
