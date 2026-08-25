import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { getAllCategories, getAvailableTools, getToolsByCategory } from '@/lib/registry';
import { ToolCard } from '@/components/tool-ui';

export const metadata = {
  title: 'VEYLO — Free tools for EVERYTHING',
  description: 'A growing collection of fast, free browser tools for testing, measuring, calculating, converting, creating, and troubleshooting. 100% client-side in your browser.',
  alternates: { canonical: SITE_CONFIG.url },
};

export default function Home() {
  const categories = getAllCategories();
  const availableTools = getAvailableTools();

  return (
    <div className="flex flex-col gap-14 py-8 animate-fade-in max-w-7xl mx-auto px-4">
      {/* VEYLO Hero */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <span
          className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-5 inline-flex items-center gap-1.5"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green, #10b981)' }} aria-hidden="true" />
          Free Browser Tools
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5" style={{ color: 'var(--text)' }}>
          Free tools for <span style={{ color: 'var(--accent)' }}>EVERYTHING.</span>
        </h1>

        <p className="text-base sm:text-lg mb-8 leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
          A growing collection of fast, free browser tools for testing, measuring, calculating, converting, creating, and troubleshooting.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span>Explore All Tools</span>
            <span>→</span>
          </Link>
          <Link
            href="/mouse-tester"
            className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
          >
            <span>Mouse Tester</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Featured Tool Spotlight */}
      <section aria-label="Featured Tool">
        <div
          className="w-full p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🖱️</span>
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: 'color-mix(in srgb, var(--accent) 15%, var(--surface))', color: 'var(--accent)' }}
              >
                Featured Tool
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
              Mouse Tester
            </h2>
            <p className="text-xs sm:text-sm max-w-2xl" style={{ color: 'var(--muted)' }}>
              Test your mouse buttons, movement, scroll wheel, double-click behavior, and more directly in your browser.
            </p>
          </div>

          <Link
            href="/mouse-tester"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center gap-2 shadow"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span>Open Mouse Tester</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Live Tools Section */}
      <section id="tools" aria-label="Popular Tools" className="flex flex-col gap-6 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
              Popular Tools
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Launch instant browser utilities across generators, text analysis, and diagnostics.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors hover:underline"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
          >
            Browse All ({availableTools.length} Live) →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availableTools
            .filter(t => t.popular || t.featured)
            .slice(0, 8)
            .map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
        </div>
      </section>

      {/* Platform Category Grid */}
      <section aria-label="Platform Categories" className="flex flex-col gap-6 pt-6" style={{ borderTop: '1px solid var(--border-c)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
              Browse By Category
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Explore our utility platform roadmap across 13 core categories.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-semibold hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            View Directory →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const catTools = getToolsByCategory(cat.id);
            const liveInCat = catTools.filter(t => t.status === 'available').length;

            return (
              <Link
                key={cat.id}
                href={`/tools?category=${cat.id}`}
                className="group p-5 rounded-2xl flex flex-col justify-between gap-3 transition-all duration-200 hover:-translate-y-1"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: liveInCat > 0 ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))' : 'var(--surface-2)',
                        color: liveInCat > 0 ? 'var(--accent)' : 'var(--muted)',
                      }}
                    >
                      {liveInCat > 0 ? `${liveInCat} Live` : 'In Dev'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
                    {cat.description}
                  </p>
                </div>

                <span className="text-xs font-semibold group-hover:underline flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                  <span>Explore category</span>
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Privacy Commitment Banner */}
      <section
        className="p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
      >
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            100% Client-Side Browser Utilities
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            VEYLO tools run locally inside your browser. No mouse coordinates, keystrokes, uploaded files, or personal data are ever sent to our servers.
          </p>
        </div>
        <Link
          href="/about"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-colors"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
        >
          About VEYLO →
        </Link>
      </section>
    </div>
  );
}
