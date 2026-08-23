import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

const CANONICAL_URL = `${SITE_CONFIG.url}/mouse-tester`;

export const metadata: Metadata = {
  title: 'Mouse Tester Online — Free Mouse Test | VEYLO',
  description: 'Free online mouse tester by VEYLO. Test your mouse buttons, clicks, scroll wheel, movement, double-click behavior, and more with 100% client-side processing in your browser.',
  keywords: [
    'mouse tester',
    'mouse test',
    'mouse button test',
    'mouse tester online',
    'mouse test online',
    'test mouse',
    'mouse clicking test',
    'mouse scroll test',
    'mouse wheel test',
    'check my mouse',
    'VEYLO',
  ],
  alternates: { canonical: CANONICAL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mouse Tester Online — Free Mouse Test | VEYLO',
    description: 'Free online mouse tester by VEYLO. Test your mouse buttons, clicks, scroll wheel, movement, and double-click behavior directly in your browser.',
    url: CANONICAL_URL,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Tester Online — Free Mouse Test | VEYLO',
    description: 'Free online mouse tester by VEYLO. Verify buttons, scroll wheel, and cursor tracking directly in your browser.',
  },
};


// JSON-LD structured data
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
    { '@type': 'ListItem', position: 2, name: 'Mouse Tester', item: CANONICAL_URL },
  ],
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mouse Tester Suite',
  url: CANONICAL_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free browser-based diagnostic utility to test computer mouse buttons, scroll wheel notches, cursor movement trail, and click event timing.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I test my mouse?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Open Mouse Tester and interact with your mouse — click buttons, move it around, and use the scroll wheel. All results appear instantly without any software installation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I test my mouse buttons?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Click each button while looking at the visual mouse at the top of the page. The corresponding button will highlight on press. The Button Diagnostics section shows whether each button has been detected.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I know if my mouse is working?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If all buttons register cleanly, the scroll wheel counts events in the correct direction, and the movement trail updates smoothly, your mouse is functioning correctly within the browser\'s detection range.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I test a mouse scroll wheel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scroll anywhere on this page. The Scroll Test panel tracks up, down, and horizontal events separately. If a direction does not register, that channel of your scroll wheel may have an issue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I test a mouse without installing software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. This tool runs entirely in your browser with no downloads, no extensions, and no account required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this website detect a broken mouse switch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A browser can observe mouse button events, but it cannot access hardware internals or guarantee a diagnosis. If a single click repeatedly registers as two clicks, that pattern is consistent with switch chatter — but to confirm, test the mouse in multiple applications and consider professional inspection.',
      },
    },
  ],
};

export default function MouseTesterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

