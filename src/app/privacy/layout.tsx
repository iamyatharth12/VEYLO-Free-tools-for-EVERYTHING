import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/privacy`;

export const metadata: Metadata = {
  title: 'Privacy Policy - Mouse Tester',
  description: 'Privacy Policy for Mouse Tester. We process mouse input data 100% locally in your browser with zero server logging.',
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
