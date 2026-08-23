'use client';

import { useRef, useState, useCallback } from 'react';
import { useMouseTester }         from '@/hooks/useMouseTester';
import MouseVisual                from './components/MouseVisual';
import StatsPanel                 from './components/StatsPanel';
import CpsTest                    from './components/CpsTest';
import DoubleClickSection         from './components/DoubleClickSection';
import MovementTest               from './components/MovementTest';
import ScrollTest                 from './components/ScrollTest';
import ButtonDiagnostics          from './components/ButtonDiagnostics';
import SeoContent                 from './components/SeoContent';
import EventLog                   from '@/components/ui/EventLog';
import RelatedTools               from '@/components/ui/RelatedTools';

// ── Toggle button ─────────────────────────────────────────────────────────────
function TestingToggle({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl
        text-sm font-bold cursor-pointer
        transition-all duration-200 active:scale-95
        ${isActive ? 'animate-glow-pulse' : ''}
      `}
      style={{
        background:   isActive
          ? 'color-mix(in srgb, var(--accent) 15%, var(--surface))'
          : 'var(--surface)',
        border:       `2px solid ${isActive ? 'var(--accent)' : 'var(--border-2)'}`,
        color:        isActive ? 'var(--accent-fg)' : 'var(--muted)',
        boxShadow:    isActive
          ? '0 0 30px color-mix(in srgb, var(--accent) 20%, transparent)'
          : 'none',
        minWidth:     200,
        justifyContent: 'center',
      }}
      aria-pressed={isActive}
      aria-label={isActive ? 'Stop testing' : 'Start testing'}
    >
      {/* Indicator dot */}
      <span
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? 'status-dot-active' : ''}`}
        style={{ background: isActive ? 'var(--green)' : 'var(--muted)' }}
        aria-hidden="true"
      />

      {/* Label */}
      <span className="tracking-wide">
        {isActive ? 'Testing Active — Click to Stop' : 'Start Testing'}
      </span>

      {/* Ripple on active */}
      {isActive && (
        <span
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '1px solid var(--accent)',
            animation: 'ripple 1.8s ease-out infinite',
            opacity: 0,
          }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MouseTesterPage() {
  const mouse = useMouseTester();
  const [resetSignal, setResetSignal] = useState(0);

  const handleReset = useCallback(() => {
    mouse.reset();
    setResetSignal(s => s + 1);
  }, [mouse]);

  const handleClearLog = useCallback(() => {
    mouse.reset();
    setResetSignal(s => s + 1);
  }, [mouse]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="text-center pt-8 pb-6 px-4 animate-fade-in">
        <p
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} aria-hidden="true"/>
          Free · No signup · 100% private
        </p>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Mouse Tester
        </h1>
        <p className="text-base sm:text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--muted)' }}>
          Test your mouse buttons, movement, scroll wheel, and clicking behavior directly in your browser.
        </p>

        {/* ── THE TOGGLE ─────────────────────────────────────────────── */}
        <TestingToggle isActive={mouse.isActive} onToggle={mouse.toggle} />

        {/* Instruction hint */}
        <p
          className="mt-3 text-xs"
          style={{ color: 'var(--muted)', transition: 'opacity 0.3s ease', opacity: mouse.isActive ? 1 : 0.5 }}
        >
          {mouse.isActive
            ? 'Click, move, or scroll anywhere — the entire page is listening'
            : 'Press Start Testing to activate mouse capture'}
        </p>
      </section>

      {/* ── Main Panel ──────────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl mb-8 overflow-hidden animate-slide-up"
        style={{
          background:  'var(--surface)',
          border:      `1px solid ${mouse.isActive ? 'var(--accent)' : 'var(--border-c)'}`,
          boxShadow:   mouse.isActive ? '0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent)' : 'none',
          transition:  'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        aria-label="Main mouse testing panel"
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center gap-2">
            {/* Status dot */}
            <span
              className={`w-2 h-2 rounded-full ${mouse.isActive ? 'status-dot-active' : ''}`}
              style={{ background: mouse.isActive ? 'var(--green)' : 'var(--border-2)' }}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: mouse.isActive ? 'var(--accent)' : 'var(--muted)' }}>
              {mouse.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Inline start/stop for panel context */}
            <button
              onClick={mouse.toggle}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all duration-150"
              style={{
                background:  mouse.isActive ? 'color-mix(in srgb, var(--red) 12%, var(--surface-2))' : 'color-mix(in srgb, var(--green) 12%, var(--surface-2))',
                border:      `1px solid ${mouse.isActive ? 'var(--red)' : 'var(--green)'}`,
                color:       mouse.isActive ? 'var(--red)' : 'var(--green)',
              }}
              aria-pressed={mouse.isActive}
            >
              {mouse.isActive ? 'Stop' : 'Start'}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--muted)' }}
              aria-label="Reset all test data"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[220px_1fr] gap-0">
          {/* Left — Mouse visual */}
          <div
            className="flex flex-col items-center gap-6 p-6"
            style={{ borderRight: '1px solid var(--border-c)' }}
          >
            <MouseVisual buttons={mouse.buttons} scroll={mouse.scroll} isActive={mouse.isActive} />
          </div>

          {/* Right — Stats + diagnostics */}
          <div className="p-6 flex flex-col gap-6">
            <StatsPanel stats={mouse.stats} />
            <ButtonDiagnostics buttons={mouse.buttons} />
          </div>
        </div>
      </section>

      {/* ── Event Monitor ───────────────────────────────────────────────────── */}
      <section className="mb-8">
        <EventLog events={mouse.events} onClear={handleClearLog} />
      </section>

      {/* ── Row: CPS + Double-Click + Scroll ────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <CpsTest />
        <DoubleClickSection dc={mouse.doubleClick} />
        <ScrollTest scroll={mouse.scroll} />
      </div>

      {/* ── Movement Test ────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <MovementTest movement={mouse.movement} resetSignal={resetSignal} />
      </section>

      {/* ── Privacy notice ───────────────────────────────────────────────────── */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm mb-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        role="note"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--green)', marginTop: '2px', flexShrink: 0 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p style={{ color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Privacy first: </strong>
          Your mouse activity is processed locally in your browser. We don&apos;t upload or store your mouse input.
        </p>
      </div>

      {/* ── Related Tools ────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <RelatedTools />
      </section>

      {/* ── SEO Content ──────────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl p-6 sm:p-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
      >
        <SeoContent />
      </section>
    </>
  );
}
