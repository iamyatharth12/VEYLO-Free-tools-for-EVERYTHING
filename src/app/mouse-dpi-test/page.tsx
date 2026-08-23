import Link from 'next/link';
import DpiCalculator from '@/components/tools/DpiCalculator';
import RelatedTools from '@/components/ui/RelatedTools';
import AdSlot from '@/components/ui/AdSlot';

export default function MouseDpiTestPage() {
  return (
    <div className="flex flex-col gap-10 py-6 animate-fade-in">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Mouse DPI Test &amp; eDPI Calculator
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--muted)' }}>
          Estimate your physical mouse DPI (Dots Per Inch) and calculate true eDPI (Effective DPI) sensitivity across video games.
        </p>
      </section>

      {/* Interactive Tool */}
      <section className="animate-slide-up" aria-label="Interactive mouse DPI and eDPI calculator">
        <DpiCalculator />
      </section>

      {/* Internal Link Callout */}
      <div className="p-4 rounded-xl text-center text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}>
        Testing gaming performance? Combine your DPI with our{' '}
        <Link href="/mouse-polling-rate-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          Mouse Polling Rate (Hz) Test
        </Link>{' '}
        or measure raw click speed with the{' '}
        <Link href="/cps-test" className="font-bold underline" style={{ color: 'var(--accent)' }}>
          CPS Test
        </Link>.
      </div>

      <AdSlot position="inline" />

      {/* SEO Content */}
      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          What is Mouse DPI?
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          DPI stands for <strong style={{ color: 'var(--text)' }}>Dots Per Inch</strong> (technically CPI or Counts Per Inch). It measures how many cursor pixels on your screen move when you drag your physical mouse across one inch of mousepad distance. For example, at 800 DPI, moving your mouse 1 inch physically moves your cursor 800 pixels on screen.
        </p>

        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          What is eDPI (Effective DPI)?
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          eDPI allows players to compare true mouse sensitivity across different hardware setups. It is calculated by multiplying your mouse hardware DPI by your in-game sensitivity setting:
        </p>

        <div className="p-4 rounded-xl font-mono text-sm font-bold text-center" style={{ background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--border-c)' }}>
          eDPI = Hardware DPI × In-Game Sensitivity
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          For instance, a player using 400 DPI with 2.0 in-game sensitivity has an eDPI of 800 (400 × 2.0). Another player using 800 DPI with 1.0 in-game sensitivity also has an eDPI of 800—meaning both players experience identical cursor sensitivity!
        </p>
      </article>

      <RelatedTools />
    </div>
  );
}
