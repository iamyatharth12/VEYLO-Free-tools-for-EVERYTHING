import React from 'react';
import Link from 'next/link';
import { getCategoryById } from '@/lib/registry';

interface ToolHeaderProps {
  title: string;
  description: string;
  category?: string;
  badge?: string;
  icon?: string;
  actions?: React.ReactNode;
}

export default function ToolHeader({
  title,
  description,
  category,
  badge,
  icon,
  actions,
}: ToolHeaderProps) {
  const categoryData = category ? getCategoryById(category) : undefined;

  return (
    <header className="flex flex-col gap-3 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {categoryData && (
            <Link
              href={`/tools?category=${categoryData.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors hover:border-[var(--accent)]"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-c)',
                color: 'var(--muted)',
              }}
            >
              <span>{categoryData.icon}</span>
              <span>{categoryData.name}</span>
            </Link>
          )}

          {badge && (
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
              style={{
                background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))',
                color: 'var(--accent)',
              }}
            >
              {badge}
            </span>
          )}

          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--muted)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green, #10b981)' }} aria-hidden="true" />
            Client-Side
          </span>
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {icon && <span className="text-3xl sm:text-4xl select-none" aria-hidden="true">{icon}</span>}
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
      </div>

      <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: 'var(--muted)' }}>
        {description}
      </p>
    </header>
  );
}
