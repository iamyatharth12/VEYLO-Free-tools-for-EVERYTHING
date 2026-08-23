import Link from 'next/link';
import { getRelatedTools } from '@/lib/registry';

interface RelatedToolsProps {
  currentSlug: string;
  limit?: number;
  title?: string;
  className?: string;
}

export default function RelatedTools({
  currentSlug,
  limit = 3,
  title = 'Related Tools',
  className = '',
}: RelatedToolsProps) {
  const related = getRelatedTools(currentSlug, limit);


  if (related.length === 0) return null;

  return (
    <section
      aria-label="Related tools"
      className={`p-6 sm:p-8 rounded-2xl flex flex-col gap-5 ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-c)',
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        <Link
          href="/tools"
          className="text-xs font-semibold hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          View All Tools →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group p-4 rounded-xl flex flex-col justify-between gap-3 transition-all duration-150 hover:-translate-y-0.5"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-c)',
            }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xl" aria-hidden="true">{tool.icon}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--accent)',
                    border: '1px solid var(--border-c)',
                  }}
                >
                  Live
                </span>
              </div>
              <h3
                className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--text)' }}
              >
                {tool.name}
              </h3>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
                {tool.shortDescription}
              </p>
            </div>

            <div
              className="flex items-center justify-between text-xs font-bold pt-2"
              style={{ borderTop: '1px solid var(--border-c)', color: 'var(--accent)' }}
            >
              <span>Open</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
