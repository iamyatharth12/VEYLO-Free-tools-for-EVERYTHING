import Link from 'next/link';
import PollingRateTester from '@/components/tools/PollingRateTester';
import RelatedTools from '@/components/ui/RelatedTools';
import AdSlot from '@/components/ui/AdSlot';

export default function MousePollingRateTestPage() {
  return (
    <div className="flex flex-col gap-10 py-6 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Mouse Polling Rate Test
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
          Measure your mouse polling frequency (Hz) and report interval in real-time. Check whether your gaming mouse reaches 500Hz, 1000Hz, or higher.
        </p>
      </section>

      {/* Interactive Tool */}
      <section className="animate-slide-up" aria-label="Interactive mouse polling rate tester">
        <PollingRateTester />
      </section>

      {/* Internal Navigation Anchor */}
      <div className="p-4 rounded-xl text-center text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        Want to calculate mouse sensitivity and eDPI? Use our{' '}
        <Link href="/mouse-dpi-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse DPI Test & Calculator
        </Link>{' '}
        or test click response on the main{' '}
        <Link href="/mouse-tester" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Tester
        </Link>.
      </div>

      <AdSlot position="inline" />

      {/* SEO Content */}
      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          What is Mouse Polling Rate (Hz)?
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Polling rate (measured in Hertz / Hz) represents how frequently your mouse sends updated cursor position data to your computer CPU per second. Higher polling rates reduce input delay and make cursor tracking significantly smoother.
        </p>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          Polling Rate Hz vs Delay Comparison
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>125 Hz</span>
            <span style={{ color: 'var(--muted)' }}>Updates every 8.0 ms. Standard default for non-gaming office mice.</span>
          </div>
          <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>500 Hz</span>
            <span style={{ color: 'var(--muted)' }}>Updates every 2.0 ms. Good balance for legacy systems and laptop battery saving.</span>
          </div>
          <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--green)' }}>1000 Hz</span>
            <span style={{ color: 'var(--muted)' }}>Updates every 1.0 ms. The gold standard for modern esports and gaming mice.</span>
          </div>
        </div>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          Browser Measurement Note
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Browser event dispatch rates depend on your operating system display refresh rate and active browser rendering frame rate. For ultra-high polling rates (&gt;2000Hz), ensure hardware acceleration is enabled in browser settings.
        </p>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          Frequently Asked Questions
        </h3>
        <div className="flex flex-col gap-4 text-sm" style={{ color: 'var(--muted)' }}>
          <div>
            <h4 className="font-bold" style={{ color: 'var(--text)' }}>What is mouse polling rate?</h4>
            <p className="mt-1">Polling rate (measured in Hz) is how often your mouse sends position data to your computer per second. 1000Hz sends data every 1 millisecond.</p>
          </div>
          <div>
            <h4 className="font-bold" style={{ color: 'var(--text)' }}>Why is my polling rate test reading lower than 1000Hz?</h4>
            <p className="mt-1">You need to move your mouse rapidly to generate enough motion events for the sensor to transmit at its maximum polling frequency. Also check that your monitor refresh rate and browser hardware acceleration are enabled.</p>
          </div>
        </div>
      </article>

      <RelatedTools />
    </div>
  );
}

