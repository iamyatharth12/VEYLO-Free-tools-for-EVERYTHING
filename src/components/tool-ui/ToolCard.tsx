import Link from 'next/link';
import { ToolMetadata } from '@/lib/registry/tools';
import { getCategoryById } from '@/lib/registry';

interface ToolCardProps {
  tool: ToolMetadata;
  showCategory?: boolean;
  className?: string;
}

export default function ToolCard({
  tool,
  showCategory = true,
  className = '',
}: ToolCardProps) {
  const category = getCategoryById(tool.category);
  const isAvailable = tool.status === 'available';

  const cardContent = (
    <div
      className={`group p-5 rounded-2xl flex flex-col justify-between gap-3.5 transition-all duration-200 h-full ${
        isAvailable ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer' : 'opacity-70'
      } ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-c)',
      }}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl" aria-hidden="true">{tool.icon}</span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {showCategory && category && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border-c)' }}
              >
                {category.shortName}
              </span>
            )}

            {isAvailable ? (
              tool.featured ? (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                    color: 'var(--accent)',
                  }}
                >
                  Featured
                </span>
              ) : (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--green, #10b981)',
                    border: '1px solid var(--border-c)',
                  }}
                >
                  Live
                </span>
              )
            ) : (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
              >
                In Dev
              </span>
            )}
          </div>
        </div>

        <h3
          className={`text-base font-bold transition-colors ${
            isAvailable ? 'group-hover:text-[var(--accent)]' : ''
          }`}
          style={{ color: 'var(--text)' }}
        >
          {tool.name}
        </h3>

        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          {tool.shortDescription}
        </p>
      </div>

      <div
        className="flex items-center justify-between text-xs font-bold pt-2.5 mt-auto"
        style={{ borderTop: '1px solid var(--border-c)' }}
      >
        {isAvailable ? (
          <>
            <span style={{ color: 'var(--accent)' }} className="group-hover:underline">
              Launch Tool
            </span>
            <span style={{ color: 'var(--accent)' }} aria-hidden="true">→</span>
          </>
        ) : (
          <span style={{ color: 'var(--muted)' }} className="text-[11px] font-normal italic">
            Planned in roadmap
          </span>
        )}
      </div>
    </div>
  );

  if (!isAvailable) {
    return <div className="h-full">{cardContent}</div>;
  }

  return (
    <Link href={`/${tool.slug}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl">
      {cardContent}
    </Link>
  );
}
