import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 py-6 max-w-4xl mx-auto animate-fade-in">
      <section className="text-center flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          About Mouse Tester
        </h1>
        <p className="text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>
          A free, privacy-first web application designed to help users test computer mice, benchmark polling rates, check switch chatter, and verify input hardware.
        </p>
      </section>

      <article className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Why Mouse Tester Exists</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Computer input devices—especially gaming mice and ergonomic pointing devices—are subject to mechanical wear, switch chatter, and driver misconfigurations. Traditional hardware testing often required installing bulky proprietary software or executable files. Mouse Tester was created to provide instant, browser-native diagnostic tools that run on any device with zero software installation required.
        </p>

        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Our Technical &amp; Privacy Philosophy</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>100% Local DOM Processing</h3>
            <p style={{ color: 'var(--muted)' }}>
              All mouse click events, cursor coordinate movement math, scroll wheel delta calculations, and timing measurements are processed locally inside your browser runtime memory.
            </p>
          </div>

          <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Zero Input Logging</h3>
            <p style={{ color: 'var(--muted)' }}>
              We do not track, log, transmit, or record your mouse clicks, cursor paths, or personal user data to any external server or backend API.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Explore Our Tools</h2>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <Link href="/mouse-tester" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Tester Suite</Link>
          <Link href="/mouse-click-test" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Click Test</Link>
          <Link href="/double-click-test" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Double Click Test</Link>
          <Link href="/mouse-scroll-test" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Scroll Test</Link>
          <Link href="/mouse-polling-rate-test" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse Polling Rate Test</Link>
          <Link href="/mouse-dpi-test" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>Mouse DPI Test</Link>
          <Link href="/cps-test" className="px-3 py-2 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>CPS Test</Link>
        </div>
      </article>
    </div>
  );
}
