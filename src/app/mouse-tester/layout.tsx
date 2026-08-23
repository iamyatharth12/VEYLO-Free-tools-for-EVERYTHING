import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mousetester.app';

export const metadata: Metadata = {
  title:       'Mouse Tester - Test Your Mouse Buttons & Clicks Online',
  description: 'Free online mouse tester. Test your mouse buttons, clicks, scroll wheel, movement, double-click behavior, and more directly in your browser.',
  keywords:    'mouse tester, mouse test, mouse button test, mouse tester online, mouse test online, test mouse, mouse click test, mouse clicking test, mouse scroll test, mouse wheel test',
  alternates:  { canonical: `${BASE_URL}/mouse-tester` },
  robots:      { index: true, follow: true },
  openGraph: {
    title:       'Mouse Tester - Test Your Mouse Buttons & Clicks Online',
    description: 'Free online mouse tester. Test your mouse buttons, clicks, scroll wheel, movement, double-click behavior, and more directly in your browser.',
    url:         `${BASE_URL}/mouse-tester`,
    siteName:    'Mouse Tester',
    type:        'website',
  },
  twitter: {
    card:        'summary',
    title:       'Mouse Tester - Test Your Mouse Buttons & Clicks Online',
    description: 'Free online mouse tester. Test your mouse buttons, clicks, scroll wheel, movement, double-click behavior, and more.',
  },
};

// JSON-LD structured data
const breadcrumbSchema = {
  '@context':        'https://schema.org',
  '@type':           'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',         item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Mouse Tester', item: `${BASE_URL}/mouse-tester` },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type':    'FAQPage',
  mainEntity: [
    {
      '@type':          'Question',
      name:             'How do I test my mouse?',
      acceptedAnswer: { '@type': 'Answer', text: 'Open Mouse Tester and interact with your mouse — click buttons, move it around, and use the scroll wheel. All results appear instantly without any software installation.' },
    },
    {
      '@type':          'Question',
      name:             'How do I test my mouse buttons?',
      acceptedAnswer: { '@type': 'Answer', text: 'Click each button while looking at the mouse visual. The corresponding button will highlight on press. The Button Diagnostics section shows whether each button has been detected.' },
    },
    {
      '@type':          'Question',
      name:             'Can I test a mouse without installing software?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Mouse Tester runs entirely in your browser with no downloads, no extensions, and no account required.' },
    },
    {
      '@type':          'Question',
      name:             'Can this website detect a broken mouse switch?',
      acceptedAnswer: { '@type': 'Answer', text: 'A browser can observe mouse button events but cannot access hardware internals. If a single click repeatedly registers as two clicks, that pattern is consistent with switch chatter — but confirm by testing in multiple applications.' },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
