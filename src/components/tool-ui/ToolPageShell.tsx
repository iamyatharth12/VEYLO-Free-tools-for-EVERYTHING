import React from 'react';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import ToolHeader from './ToolHeader';
import RelatedTools from './RelatedTools';
import FAQSection, { FAQItem } from './FAQSection';
import AdSlot from '@/components/ui/AdSlot';
import { ToolMetadata } from '@/lib/registry';

interface ToolPageShellProps {
  tool: ToolMetadata;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  faqs?: FAQItem[];
  children: React.ReactNode;
  seoSection?: React.ReactNode;
  className?: string;
}

export default function ToolPageShell({
  tool,
  breadcrumbs,
  actions,
  faqs,
  children,
  seoSection,
  className = '',
}: ToolPageShellProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
    { name: 'Tools', href: '/tools' },
    { name: tool.name },
  ];

  return (
    <article className={`flex flex-col gap-8 max-w-6xl mx-auto py-6 animate-fade-in ${className}`}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={defaultBreadcrumbs} />

      {/* Header */}
      <ToolHeader
        title={tool.name}
        description={tool.shortDescription}
        category={tool.category}
        badge={tool.featured ? 'Featured Tool' : undefined}
        icon={tool.icon}
        actions={actions}
      />

      {/* Primary Tool Workspace Container */}
      <main id="tool-workspace" className="w-full">
        {children}
      </main>

      {/* Inline Ad Slot */}
      <AdSlot position="inline" />

      {/* SEO / Educational Content Section */}
      {seoSection && (
        <section
          aria-label="Tool documentation and guide"
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-c)',
          }}
        >
          {seoSection}
        </section>
      )}

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <FAQSection items={faqs} />
      )}

      {/* Related Tools */}
      <RelatedTools currentSlug={tool.slug} />
    </article>
  );
}
