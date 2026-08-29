'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  GenerateButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
const AMBIGUOUS_CHARS = 'il1Lo0O|/\\`"\'.,;:';

export default function PasswordGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('password-generator')!, []);

  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate cryptographically secure random integers uniformly
  const getRandomInt = (max: number): number => {
    const range = 0xffffffff;
    const limit = range - (range % max);
    const buffer = new Uint32Array(1);
    let randomVal = 0;
    do {
      window.crypto.getRandomValues(buffer);
      randomVal = buffer[0];
    } while (randomVal >= limit);
    return randomVal % max;
  };

  const generate = useCallback(() => {
    let pool = '';
    const guaranteed: string[] = [];

    let upper = UPPERCASE_CHARS;
    let lower = LOWERCASE_CHARS;
    let nums = NUMBER_CHARS;
    let syms = SYMBOL_CHARS;

    if (excludeAmbiguous) {
      const isNotAmbiguous = (c: string) => !AMBIGUOUS_CHARS.includes(c);
      upper = upper.split('').filter(isNotAmbiguous).join('');
      lower = lower.split('').filter(isNotAmbiguous).join('');
      nums = nums.split('').filter(isNotAmbiguous).join('');
      syms = syms.split('').filter(isNotAmbiguous).join('');
    }

    if (includeUpper && upper.length > 0) {
      pool += upper;
      guaranteed.push(upper[getRandomInt(upper.length)]);
    }
    if (includeLower && lower.length > 0) {
      pool += lower;
      guaranteed.push(lower[getRandomInt(lower.length)]);
    }
    if (includeNumbers && nums.length > 0) {
      pool += nums;
      guaranteed.push(nums[getRandomInt(nums.length)]);
    }
    if (includeSymbols && syms.length > 0) {
      pool += syms;
      guaranteed.push(syms[getRandomInt(syms.length)]);
    }

    if (!pool) {
      setPasswords(['[Select at least one character type]']);
      return;
    }

    const count = Math.min(Math.max(1, quantity), 50);
    const newPasswords: string[] = [];

    for (let q = 0; q < count; q++) {
      const chars: string[] = [];

      // Guarantee at least one character from each selected category
      for (const g of guaranteed) {
        if (chars.length < length) {
          chars.push(g);
        }
      }

      // Fill remaining length
      while (chars.length < length) {
        chars.push(pool[getRandomInt(pool.length)]);
      }

      // Fisher-Yates shuffle using crypto values
      for (let i = chars.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        const temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
      }

      newPasswords.push(chars.join(''));
    }

    setPasswords(newPasswords);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, quantity]);

  // Initial generation on mount
  useEffect(() => {
    generate();
  }, [generate]);

  const handleReset = () => {
    setLength(16);
    setIncludeUpper(true);
    setIncludeLower(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setExcludeAmbiguous(false);
    setQuantity(1);
  };

  // Entropy Calculation: E = L * log2(R)
  const entropyInfo = useMemo(() => {
    let poolSize = 0;
    if (includeUpper) poolSize += excludeAmbiguous ? 24 : 26;
    if (includeLower) poolSize += excludeAmbiguous ? 24 : 26;
    if (includeNumbers) poolSize += excludeAmbiguous ? 8 : 10;
    if (includeSymbols) poolSize += excludeAmbiguous ? 20 : 32;

    if (poolSize === 0) return { bits: 0, label: 'None', color: 'var(--muted)', percent: 0 };

    const bits = Math.round(length * Math.log2(poolSize));
    let label = 'Very Weak';
    let color = '#ef4444';
    let percent = 20;

    if (bits >= 100) {
      label = 'Very Strong';
      color = 'var(--green, #10b981)';
      percent = 100;
    } else if (bits >= 75) {
      label = 'Strong';
      color = 'var(--accent, #6366f1)';
      percent = 80;
    } else if (bits >= 50) {
      label = 'Moderate';
      color = '#f59e0b';
      percent = 55;
    } else if (bits >= 35) {
      label = 'Weak';
      color = '#f97316';
      percent = 35;
    }

    return { bits, label, color, percent };
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const allPasswordsText = passwords.join('\n');

  const faqs: FAQItem[] = [
    {
      question: 'How are passwords generated on VEYLO?',
      answer:
        'Passwords are generated 100% in your browser using the standard Web Crypto API (crypto.getRandomValues). Random bytes are gathered from your operating system hardware entropy pool, guaranteeing unbiased cryptographic randomness.',
    },
    {
      question: 'Are my generated passwords transmitted to any server?',
      answer:
        'Never. VEYLO executes zero server-side computation for password generation. All strings reside temporarily in your local browser tab memory and are immediately cleared when you close or refresh the page.',
    },
    {
      question: 'What is password entropy and how many bits do I need?',
      answer:
        'Entropy measures password unpredictability in bits (log2 of the total keyspace). Passwords with 75+ bits of entropy are practically immune to offline brute-force attacks by modern hardware clusters.',
    },
    {
      question: 'Why should I exclude ambiguous characters?',
      answer:
        'Characters like "1", "l", "I", "0", and "O" look nearly identical in standard fonts. Excluding them makes manual transcription between devices or handwritten notes error-free.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Cryptographically Secure Client-Side Password Generation
          </h2>
          <p>
            Traditional random number generators in JavaScript rely on <code>Math.random()</code>, which is pseudorandom and predictable. VEYLO utilizes the browser&apos;s native <strong>Web Crypto API</strong> to generate truly random entropy seeds sourced directly from your OS kernel.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 Hardware Entropy</h3>
              <p className="text-[11px]">Sourced directly from CSPRNG (Cryptographically Secure Pseudorandom Number Generator).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ Zero Server Logs</h3>
              <p className="text-[11px]">Zero network requests. Generated strings never leave your device.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Shannon Entropy Score</h3>
              <p className="text-[11px]">Live bit-strength calculations to ensure enterprise-grade resilience.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Primary Password Display Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-5 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              {passwords.length > 1 ? `Generated Passwords (${passwords.length})` : 'Generated Password'}
            </span>
            <div className="flex items-center gap-2">
              {passwords.length > 1 && (
                <CopyButton textToCopy={allPasswordsText} label="Copy All" size="sm" />
              )}
              {passwords.length === 1 && (
                <CopyButton textToCopy={passwords[0] || ''} label="Copy Password" />
              )}
            </div>
          </div>

          {passwords.length === 1 ? (
            <div className="py-6 flex flex-col items-center justify-center gap-3">
              <div
                className="w-full max-w-2xl text-xl sm:text-3xl font-black font-mono tracking-wider select-all p-5 rounded-2xl break-all transition-all"
                style={{
                  color: 'var(--text)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-c)',
                }}
              >
                {passwords[0] || 'Generating...'}
              </div>

              {/* Entropy Bar */}
              <div className="w-full max-w-md flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--muted)' }}>Estimated Strength:</span>
                  <span style={{ color: entropyInfo.color }} className="font-bold">
                    {entropyInfo.label} (~{entropyInfo.bits} bits)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${entropyInfo.percent}%`, background: entropyInfo.color }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto p-3 rounded-xl text-left" style={{ background: 'var(--surface-2)' }}>
              {passwords.map((pw, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
                >
                  <span className="font-mono text-xs sm:text-sm font-semibold select-all truncate" style={{ color: 'var(--text)' }}>
                    {pw}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(pw);
                      setCopiedIndex(i);
                      setTimeout(() => setCopiedIndex(null), 1500);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex-shrink-0"
                    style={{
                      background: copiedIndex === i ? 'var(--green, #10b981)' : 'var(--surface-2)',
                      color: copiedIndex === i ? '#fff' : 'var(--text)',
                      border: '1px solid var(--border-c)',
                    }}
                  >
                    {copiedIndex === i ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Controls Card */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* Length Slider & Direct Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="length-slider" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Password Length: <span className="font-mono text-sm" style={{ color: 'var(--accent)' }}>{length}</span> characters
              </label>
              <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Recommended: 16+</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                id="length-slider"
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer accent-[var(--accent)]"
              />
              <input
                type="number"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(Math.min(128, Math.max(4, Number(e.target.value) || 4)))}
                aria-label="Exact password length"
                className="w-16 p-2 text-center rounded-xl text-xs font-mono font-bold focus:outline-none"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          </div>

          {/* Character Sets Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Uppercase (A-Z)</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>ABCDEF...</span>
              </div>
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>

            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Lowercase (a-z)</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>abcdef...</span>
              </div>
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>

            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Numbers (0-9)</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>012345...</span>
              </div>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>

            <label
              className="p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Symbols (!@#$)</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--muted)' }}>!@#$%^...</span>
              </div>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent)] cursor-pointer"
              />
            </label>
          </div>

          {/* Secondary Controls & Batch Quantity */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs" style={{ borderTop: '1px solid var(--border-c)' }}>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="rounded text-[var(--accent)]"
                />
                <span>Exclude Ambiguous (l, 1, I, O, 0)</span>
              </label>

              <div className="flex items-center gap-2">
                <label htmlFor="batch-qty" className="font-semibold" style={{ color: 'var(--muted)' }}>
                  Quantity:
                </label>
                <select
                  id="batch-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="p-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                >
                  <option value={1}>1 Password</option>
                  <option value={5}>5 Passwords</option>
                  <option value={10}>10 Passwords</option>
                  <option value={25}>25 Passwords</option>
                  <option value={50}>50 Passwords</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ResetButton onClick={handleReset} />
              <GenerateButton onClick={generate} label="Regenerate" />
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
