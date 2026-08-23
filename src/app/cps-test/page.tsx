import Link from 'next/link';
import CpsChallenge from '@/components/tools/CpsChallenge';
import RelatedTools from '@/components/ui/RelatedTools';
import AdSlot from '@/components/ui/AdSlot';

export default function CpsTestPage() {
  return (
    <div className="flex flex-col gap-10 py-6 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          CPS Test — Click Speed Test
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
          How fast can you click? Measure your Clicks Per Second (CPS) score across 1s, 5s, 10s, 30s, and 60s challenges.
        </p>
      </section>

      {/* Interactive Tool */}
      <section className="animate-slide-up" aria-label="Interactive CPS click speed challenge">
        <CpsChallenge />
      </section>

      {/* Internal Navigation Anchor */}
      <div className="p-4 rounded-xl text-center text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        Are your double clicks registering unintentionally? Test microswitch chatter with the{' '}
        <Link href="/double-click-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Double Click Test
        </Link>{' '}
        or test all buttons on the{' '}
        <Link href="/mouse-click-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Click Test
        </Link>.
      </div>

      <AdSlot position="inline" />

      {/* SEO Content */}
      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          Popular Clicking Techniques Explained
        </h2>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Standard Clicking</h3>
            <p style={{ color: 'var(--muted)' }}>
              Single index finger tapping down naturally. Most players achieve 5 to 7 CPS using normal clicking.
            </p>
          </div>

          <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--accent)' }}>Jitter Clicking</h3>
            <p style={{ color: 'var(--muted)' }}>
              Vibrating arm and wrist muscles to send rapid tremors into the mouse button. Yields 9 to 14 CPS.
            </p>
          </div>

          <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--green)' }}>Butterfly Clicking</h3>
            <p style={{ color: 'var(--muted)' }}>
              Alternating index and middle fingers rapidly on the left mouse button. Yields 12 to 20 CPS.
            </p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
}
