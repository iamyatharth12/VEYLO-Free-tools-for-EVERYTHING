'use client';

import { useEffect, useState } from 'react';
import type { MouseStats } from '@/hooks/useMouseTester';
import StatCard from '@/components/ui/StatCard';

interface StatsPanelProps {
  stats: MouseStats;
}

function useSessionTimer(start: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [start]);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const duration = useSessionTimer(stats.sessionStart);

  return (
    <section aria-label="Mouse statistics">
      <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>
        Live Statistics
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard label="Total Clicks"   value={stats.totalClicks}  mono highlight={stats.totalClicks > 0} />
        <StatCard label="Left Clicks"    value={stats.leftClicks}   mono />
        <StatCard label="Right Clicks"   value={stats.rightClicks}  mono />
        <StatCard label="Middle Clicks"  value={stats.middleClicks} mono />
        <StatCard label="Movement"       value={`${Math.round(stats.movementPx).toLocaleString()} px`} mono />
        <StatCard label="Scroll Events"  value={stats.scrollEvents} mono />
        <StatCard
          label="Last Event"
          value={stats.lastEvent}
          highlight={stats.lastEvent !== '—'}
        />
        <StatCard label="Session"        value={duration} mono />
      </div>
    </section>
  );
}
