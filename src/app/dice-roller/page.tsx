'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface RolledDie {
  sides: DieType;
  value: number;
}

interface RollRecord {
  dice: RolledDie[];
  modifier: number;
  total: number;
  formula: string;
  timestamp: string;
}

const DICE_CONFIG: { sides: DieType; label: string; icon: string; color: string }[] = [
  { sides: 4, label: 'd4', icon: '🔺', color: '#f59e0b' },
  { sides: 6, label: 'd6', icon: '🎲', color: '#3b82f6' },
  { sides: 8, label: 'd8', icon: '💎', color: '#10b981' },
  { sides: 10, label: 'd10', icon: '🔶', color: '#8b5cf6' },
  { sides: 12, label: 'd12', icon: '⬡', color: '#ec4899' },
  { sides: 20, label: 'd20', icon: '⭐', color: '#f43f5e' },
  { sides: 100, label: 'd100', icon: '💯', color: '#06b6d4' },
];

export default function DiceRollerPage() {
  const tool = useMemo(() => getToolBySlug('dice-roller')!, []);

  // Dice counts in pool
  const [pool, setPool] = useState<Record<DieType, number>>({
    4: 0,
    6: 1,
    8: 0,
    10: 0,
    12: 0,
    20: 0,
    100: 0,
  });

  const [modifier, setModifier] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const [currentRoll, setCurrentRoll] = useState<RollRecord>({
    dice: [{ sides: 6, value: 5 }],
    modifier: 0,
    total: 5,
    formula: '1d6 = 5',
    timestamp: 'Initial',
  });

  const [history, setHistory] = useState<RollRecord[]>([]);

  // Update die count in pool
  const updateCount = (sides: DieType, delta: number) => {
    setPool(prev => {
      const next = Math.max(0, Math.min(20, prev[sides] + delta));
      return { ...prev, [sides]: next };
    });
  };

  // Roll single quick die
  const rollSingleDie = (sides: DieType) => {
    setPool({
      4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0,
      [sides]: 1,
    });
    executeRoll({ [sides]: 1 } as Record<DieType, number>, modifier);
  };

  const totalDiceInPool = Object.values(pool).reduce((acc, count) => acc + count, 0);

  const executeRoll = useCallback((activePool: Record<DieType, number>, mod: number) => {
    setIsRolling(true);

    setTimeout(() => {
      const rolled: RolledDie[] = [];

      (Object.keys(activePool) as unknown as DieType[]).forEach(sides => {
        const count = activePool[sides] || 0;
        for (let i = 0; i < count; i++) {
          const buf = new Uint32Array(1);
          window.crypto.getRandomValues(buf);
          const val = (buf[0] % sides) + 1;
          rolled.push({ sides, value: val });
        }
      });

      if (rolled.length === 0) {
        // Default to 1d6 if empty
        rolled.push({ sides: 6, value: Math.floor(Math.random() * 6) + 1 });
      }

      const sum = rolled.reduce((acc, d) => acc + d.value, 0);
      const total = sum + mod;

      // Construct formula string
      const diceBreakdown = rolled.map(d => d.value).join(' + ');
      const formula = mod !== 0
        ? `(${diceBreakdown}) ${mod >= 0 ? `+ ${mod}` : `- ${Math.abs(mod)}`} = ${total}`
        : `${diceBreakdown} = ${total}`;

      const record: RollRecord = {
        dice: rolled,
        modifier: mod,
        total,
        formula,
        timestamp: new Date().toLocaleTimeString(),
      };

      setCurrentRoll(record);
      setHistory(prev => [record, ...prev.slice(0, 14)]);
      setIsRolling(false);
    }, 200);
  }, []);

  const handleRoll = () => {
    executeRoll(pool, modifier);
  };

  const handleReset = () => {
    setPool({ 4: 0, 6: 1, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 });
    setModifier(0);
    setCurrentRoll({
      dice: [{ sides: 6, value: 5 }],
      modifier: 0,
      total: 5,
      formula: '1d6 = 5',
      timestamp: 'Initial',
    });
  };

  const faqs: FAQItem[] = [
    {
      question: 'What dice types are supported in this roller?',
      answer:
        'All standard tabletop polyhedral dice are supported: d4 (tetrahedron), d6 (cube), d8 (octahedron), d10 (pentagonal trapezohedron), d12 (dodecahedron), d20 (icosahedron), and d100 (percentile).',
    },
    {
      question: 'Can I add modifiers like D&D +5 attack bonuses?',
      answer:
        'Yes. Use the Modifier input to add positive or negative modifiers to your roll sum automatically.',
    },
    {
      question: 'How are critical hits and fails highlighted?',
      answer:
        'When rolling a d20, rolling a Natural 20 is highlighted in gold (Critical Success) and a Natural 1 is highlighted in red (Critical Failure).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            About the VEYLO Polyhedral Dice Roller
          </h2>
          <p>
            Whether you&apos;re playing Dungeons &amp; Dragons (D&amp;D 5e), Pathfinder, Warhammer, Call of Cthulhu, or classic board games, the VEYLO Dice Roller provides instant, non-weighted random dice rolls with custom pool builders and modifier math.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🎲 Multi-Dice Pools</h3>
              <p className="text-[11px]">Combine any number of d4, d6, d8, d10, d12, d20, and d100 dice simultaneously.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚔️ D&amp;D Stat Modifiers</h3>
              <p className="text-[11px]">Automatically add ability modifiers and proficiency bonuses to the total.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📜 Formula &amp; History</h3>
              <p className="text-[11px]">Audit individual dice rolls and review previous roll history logs.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Dice Pool Builder Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Select Dice to Roll ({totalDiceInPool || 1} Selected)
            </h2>
            <button
              type="button"
              onClick={() => setPool({ 4: 0, 6: 0, 8: 0, 10: 0, 12: 0, 20: 0, 100: 0 })}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Clear Pool
            </button>
          </div>

          {/* Dice Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {DICE_CONFIG.map(die => {
              const count = pool[die.sides];
              return (
                <div
                  key={die.sides}
                  className="p-3.5 rounded-2xl flex flex-col items-center justify-between gap-3 transition-all"
                  style={{
                    background: count > 0 ? 'color-mix(in srgb, var(--accent) 10%, var(--surface-2))' : 'var(--surface-2)',
                    border: count > 0 ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => rollSingleDie(die.sides)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                    title={`Quick roll 1${die.label}`}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">
                      {die.icon}
                    </span>
                    <span className="font-black text-sm" style={{ color: 'var(--text)' }}>
                      {die.label}
                    </span>
                  </button>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 w-full justify-between pt-1" style={{ borderTop: '1px solid var(--border-c)' }}>
                    <button
                      type="button"
                      onClick={() => updateCount(die.sides, -1)}
                      disabled={count === 0}
                      aria-label={`Decrease ${die.label}`}
                      className="w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                    >
                      -
                    </button>
                    <span className="font-bold text-xs font-mono" style={{ color: count > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCount(die.sides, 1)}
                      aria-label={`Increase ${die.label}`}
                      className="w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center transition-colors"
                      style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modifier & Primary Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <div className="flex items-center gap-3">
              <label htmlFor="mod-input" className="font-bold" style={{ color: 'var(--text)' }}>
                Modifier (+/-):
              </label>
              <input
                id="mod-input"
                type="number"
                value={modifier}
                onChange={(e) => setModifier(Number(e.target.value))}
                className="w-20 p-2 rounded-xl text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <button
                type="button"
                onClick={handleRoll}
                disabled={isRolling}
                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-2"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                <span>🎲</span>
                <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Hero Card */}
        <div
          className="p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-center gap-6 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Roll Total
            </span>
            <CopyButton textToCopy={currentRoll.formula} label="Copy Formula" />
          </div>

          {/* Large Sum Display */}
          <div className="flex flex-col items-center gap-2 py-4">
            <div
              className={`text-6xl sm:text-8xl font-black font-mono tracking-tight px-8 py-3 rounded-3xl transition-transform select-all ${
                isRolling ? 'scale-90 opacity-60' : 'scale-100'
              }`}
              style={{
                color: 'var(--accent)',
                background: 'color-mix(in srgb, var(--accent) 8%, var(--surface))',
                border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
              }}
            >
              {currentRoll.total}
            </div>

            <p className="text-sm font-mono font-medium pt-1" style={{ color: 'var(--muted)' }}>
              {currentRoll.formula}
            </p>
          </div>

          {/* Individual Rolled Dice Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-4" style={{ borderTop: '1px solid var(--border-c)' }}>
            {currentRoll.dice.map((die, idx) => {
              const isNat20 = die.sides === 20 && die.value === 20;
              const isNat1 = die.sides === 20 && die.value === 1;

              return (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs"
                  style={{
                    background: isNat20 ? '#fef08a' : isNat1 ? '#fee2e2' : 'var(--surface-2)',
                    color: isNat20 ? '#854d0e' : isNat1 ? '#991b1b' : 'var(--text)',
                    border: isNat20 ? '1px solid #eab308' : isNat1 ? '1px solid #ef4444' : '1px solid var(--border-c)',
                  }}
                >
                  <span className="text-xs font-semibold opacity-70">d{die.sides}:</span>
                  <span className="text-base font-black font-mono">{die.value}</span>
                  {isNat20 && <span className="text-[10px] font-black uppercase tracking-wider">NAT 20!</span>}
                  {isNat1 && <span className="text-[10px] font-black uppercase tracking-wider">NAT 1</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Roll History */}
        {history.length > 1 && (
          <div
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Recent Roll History
              </h3>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[11px] font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Clear History
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto text-xs">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl flex items-center justify-between gap-3 font-mono"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    Total: {h.total} <span className="text-xs font-normal opacity-70">({h.formula})</span>
                  </span>
                  <span className="text-[10px] opacity-60 flex-shrink-0">
                    {h.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
