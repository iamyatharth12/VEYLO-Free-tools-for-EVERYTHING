import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] gap-6 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
        🔍
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
          404 — Page Not Found
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          The requested utility page could not be found or may have moved to a different URL.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl transition-all"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Return to Homepage
        </Link>

        <Link
          href="/mouse-tester"
          className="px-5 py-2.5 rounded-xl transition-all"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
        >
          Open Mouse Tester
        </Link>
      </div>
    </div>
  );
}
