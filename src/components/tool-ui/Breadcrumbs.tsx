import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Build full list including Home
  const fullList = [
    { name: 'Home', href: '/' },
    ...items,
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullList.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_CONFIG.url}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-xs mb-4">
        <ol className="flex items-center flex-wrap gap-1.5" style={{ color: 'var(--muted)' }}>
          {fullList.map((item, index) => {
            const isLast = index === fullList.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:underline transition-colors"
                    style={{ color: 'var(--muted)' }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span
                    className="font-medium truncate max-w-[200px] sm:max-w-none"
                    aria-current={isLast ? 'page' : undefined}
                    style={{ color: isLast ? 'var(--text)' : 'var(--muted)' }}
                  >
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
