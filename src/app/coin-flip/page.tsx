'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type CoinSide = 'heads' | 'tails';

interface TossResult {
  side: CoinSide;
  id: number;
}

export default function CoinFlipPage() {
  const tool = useMemo(() => getToolBySlug('coin-flip')!, []);

  const [coinCount, setCoinCount] = useState<number>(1);
  const [currentResults, setCurrentResults] = useState<TossResult[]>([{ side: 'heads', id: 1 }]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    heads: 0,
    tails: 0,
    currentStreak: 0,
    streakSide: null as CoinSide | null,
    longestStreak: 0,
  });

  const [history, setHistory] = useState<{ results: CoinSide[]; timestamp: string }[]>([]);

  const flipCoins = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);

    setTimeout(() => {
      const newResults: TossResult[] = [];
      let newHeads = 0;
      let newTails = 0;

      for (let i = 0; i < coinCount; i++) {
        // Use crypto random
        const buf = new Uint8Array(1);
        window.crypto.getRandomValues(buf);
        const side: CoinSide = buf[0] % 2 === 0 ? 'heads' : 'tails';
        if (side === 'heads') newHeads++;
        else newTails++;
        newResults.push({ side, id: i + 1 });
      }

      setCurrentResults(newResults);

      // Update statistics
      setStats(prev => {
        const total = prev.total + coinCount;
        const heads = prev.heads + newHeads;
        const tails = prev.tails + newTails;

        let streak = prev.currentStreak;
        let streakSide = prev.streakSide;
        let longest = prev.longestStreak;

        if (coinCount === 1) {
          const single = newResults[0].side;
          if (single === streakSide) {
            streak++;
          } else {
            streak = 1;
            streakSide = single;
          }
          if (streak > longest) longest = streak;
        }

        return {
          total,
          heads,
          tails,
          currentStreak: streak,
          streakSide,
          longestStreak: longest,
        };
      });

      setHistory(prev => [
        { results: newResults.map(r => r.side), timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 19),
      ]);

      setIsFlipping(false);
    }, 600);
  }, [coinCount, isFlipping]);

  const resetStats = () => {
    setStats({
      total: 0,
      heads: 0,
      tails: 0,
      currentStreak: 0,
      streakSide: null,
      longestStreak: 0,
    });
    setHistory([]);
    setCurrentResults([{ side: 'heads', id: 1 }]);
  };

  const headsPercent = stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 50;
  const tailsPercent = stats.total > 0 ? Math.round((stats.tails / stats.total) * 100) : 50;

  const faqs: FAQItem[] = [
    {
      question: 'Is the coin flip truly 50/50 fair?',
      answer:
        'Yes. VEYLO uses the cryptographic Web Crypto API to ensure an unbiased, mathematically fair 50/50 probability on every flip.',
    },
    {
      question: 'Can I flip multiple coins at once?',
      answer:
        'Yes. Choose between 1, 2, 3, 5, 10, or 20 coins to simulate multiple flips simultaneously.',
    },
    {
      question: 'How are streaks calculated?',
      answer:
        'When flipping 1 coin at a time, the tool automatically tracks your current consecutive win streak and all-time longest streak.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Coin Flip Simulator
          </h2>
          <p>
            Need to settle a bet, make a quick decision, or teach probability in the classroom? The VEYLO Coin Flipper provides realistic physics animations and live statistical tracking without installing any apps.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚖️ Unbiased Decisions</h3>
              <p className="text-[11px]">Fair 50/50 binary decision maker for sports kickoffs, turn order, and debates.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📊 Live Probability Stats</h3>
              <p className="text-[11px]">Monitor the Law of Large Numbers as Heads and Tails percentages converge over time.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🪙 Batch Tosses</h3>
              <p className="text-[11px]">Flip up to 20 coins simultaneously for tabletop RPGs and statistical experiments.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Main Flipper Stage Card */}
        <div
          className="p-8 sm:p-12 rounded-3xl flex flex-col items-center justify-center gap-8 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Animated Coin Container */}
          <div className="flex flex-wrap items-center justify-center gap-6 min-h-[160px]">
            {currentResults.map((coin, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 cursor-pointer select-none"
                onClick={flipCoins}
              >
                <div
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 font-black text-center ${
                    isFlipping ? 'animate-spin' : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    background:
                      coin.side === 'heads'
                        ? 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)'
                        : 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #64748b 100%)',
                    border: '4px solid rgba(255, 255, 255, 0.4)',
                    boxShadow:
                      coin.side === 'heads'
                        ? '0 10px 25px rgba(234, 179, 8, 0.35)'
                        : '0 10px 25px rgba(148, 163, 184, 0.35)',
                    color: coin.side === 'heads' ? '#713f12' : '#0f172a',
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl" aria-hidden="true">
                      {coin.side === 'heads' ? '👑' : '🛡️'}
                    </span>
                    <span className="text-xs uppercase tracking-widest font-black mt-1">
                      {coin.side}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Flip Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={flipCoins}
              disabled={isFlipping}
              className="w-full py-4 px-8 rounded-2xl font-black text-base transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center gap-2"
              style={{
                background: 'var(--accent)',
                color: '#ffffff',
              }}
            >
              <span>🪙</span>
              <span>{isFlipping ? 'Flipping...' : `Flip ${coinCount === 1 ? 'Coin' : `${coinCount} Coins`}`}</span>
            </button>
          </div>

          {/* Quantity selector pills */}
          <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
            <span className="font-semibold" style={{ color: 'var(--muted)' }}>Number of Coins:</span>
            {[1, 2, 3, 5, 10].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setCoinCount(n);
                  setCurrentResults(Array(n).fill({ side: 'heads', id: 1 }));
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  coinCount === n ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: coinCount === n ? 'var(--accent)' : 'var(--surface-2)',
                  color: coinCount === n ? '#ffffff' : 'var(--text)',
                  border: '1px solid var(--border-c)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Flip Statistics ({stats.total} Total Flips)
            </h2>
            <ResetButton onClick={resetStats} label="Reset Statistics" />
          </div>

          {/* Progress split bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5" style={{ color: '#ca8a04' }}>
                👑 Heads: {stats.heads} ({headsPercent}%)
              </span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                🛡️ Tails: {stats.tails} ({tailsPercent}%)
              </span>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--surface-2)' }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${headsPercent}%`, background: '#eab308' }}
              />
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${tailsPercent}%`, background: '#94a3b8' }}
              />
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Total Flips</span>
              <span className="text-xl font-black font-mono" style={{ color: 'var(--text)' }}>{stats.total}</span>
            </div>

            <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Heads</span>
              <span className="text-xl font-black font-mono" style={{ color: '#ca8a04' }}>{stats.heads}</span>
            </div>

            <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Tails</span>
              <span className="text-xl font-black font-mono" style={{ color: '#64748b' }}>{stats.tails}</span>
            </div>

            <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Longest Streak</span>
              <span className="text-xl font-black font-mono" style={{ color: 'var(--accent)' }}>
                {stats.longestStreak}
              </span>
            </div>
          </div>
        </div>

        {/* Toss History */}
        {history.length > 0 && (
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Recent Toss History
              </h3>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Latest 20 Tosses</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                >
                  <span>{h.results.map(r => (r === 'heads' ? '👑' : '🛡️')).join(' ')}</span>
                  <span className="text-[10px] opacity-60">({h.timestamp})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
