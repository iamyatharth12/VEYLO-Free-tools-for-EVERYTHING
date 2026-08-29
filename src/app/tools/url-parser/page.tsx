'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_URL = 'https://developer:secretPass@api.example.com:8443/v2/analytics/reports?org=veylo&interval=daily&limit=100&tags=fast%2Cfree#chart-view';

export default function UrlParserPage() {
  const tool = useMemo(() => getToolBySlug('tools/url-parser')!, []);

  const [inputUrl, setInputUrl] = useState<string>(SAMPLE_URL);

  const parsed = useMemo(() => {
    const raw = inputUrl.trim();
    if (!raw) return { valid: false, error: null, urlObj: null, params: [] };

    // If user forgot protocol, try prefixing with https://
    let toParse = raw;
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw)) {
      toParse = `https://${raw}`;
    }

    try {
      const urlObj = new URL(toParse);
      const params: { key: string; value: string; rawValue: string }[] = [];

      urlObj.searchParams.forEach((value, key) => {
        params.push({
          key,
          value,
          rawValue: encodeURIComponent(value),
        });
      });

      return {
        valid: true,
        error: null,
        urlObj,
        params,
        protocol: urlObj.protocol,
        username: urlObj.username,
        password: urlObj.password ? '••••••••' : '',
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? '443 (default)' : urlObj.protocol === 'http:' ? '80 (default)' : 'N/A'),
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
      };
    } catch (err) {
      return {
        valid: false,
        error: `Invalid URL Format: ${(err as Error).message}. Ensure the URL format is valid.`,
        urlObj: null,
        params: [],
      };
    }
  }, [inputUrl]);

  const handleReset = () => {
    setInputUrl('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'What are the main components of a standard URL?',
      answer:
        'A URL consists of:\n• Protocol/Scheme (e.g. `https:`)\n• Authority / Hostname (e.g. `api.example.com`)\n• Port (e.g. `8443` or default `443`/`80`)\n• Pathname (e.g. `/v2/reports`)\n• Search / Query String (`?org=veylo&limit=100`)\n• Hash Fragment (`#chart-view`)',
    },
    {
      question: 'Does the parser decode percent-encoded query parameters?',
      answer:
        'Yes. The query parameters table shows both the human-readable decoded parameter value and the raw URL-encoded string.',
    },
    {
      question: 'What happens if a URL lacks a protocol (e.g. example.com)?',
      answer:
        'The parser automatically handles protocol-less domains by safely assuming `https://` for parsing convenience.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Browser-Native URL Architecture &amp; Query String Inspector
          </h2>
          <p>
            Deconstruct web URLs into individual protocol, domain host, port number, endpoint path, and query parameter key-value pairs using the standard Web URL API.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🌐 Full Component Breakdown</h3>
              <p className="text-[11px]">Inspect protocol, credentials, hostname, port, path, and hash.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📋 Query Parameters Table</h3>
              <p className="text-[11px]">Interactive key-value breakdown with decoded values and 1-click copying.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⚡ Zero Server Calls</h3>
              <p className="text-[11px]">Parsed 100% locally via browser-native new URL() constructors.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Input Bar */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="url-parse-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Enter Web URL to Parse
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputUrl(SAMPLE_URL)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Sample URL
              </button>
              <ResetButton onClick={handleReset} label="Clear" />
            </div>
          </div>

          <input
            id="url-parse-input"
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste any URL (e.g. https://api.example.com/v1/users?id=123#tab)..."
            className="w-full p-4 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />

          {parsed.error && (
            <div className="p-3 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20">
              {parsed.error}
            </div>
          )}
        </div>

        {/* URL Component Grid */}
        {parsed.valid && parsed.urlObj && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Protocol */}
              <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Protocol</span>
                  <CopyButton textToCopy={parsed.protocol || ''} size="sm" />
                </div>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--text)' }}>{parsed.protocol}</span>
              </div>

              {/* Hostname */}
              <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Hostname / Domain</span>
                  <CopyButton textToCopy={parsed.hostname || ''} size="sm" />
                </div>
                <span className="text-sm font-mono font-bold truncate" style={{ color: 'var(--text)' }}>{parsed.hostname}</span>
              </div>

              {/* Port */}
              <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Port</span>
                  <CopyButton textToCopy={parsed.port || ''} size="sm" />
                </div>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--text)' }}>{parsed.port}</span>
              </div>

              {/* Hash Fragment */}
              <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Hash Fragment</span>
                  <CopyButton textToCopy={parsed.hash || ''} size="sm" />
                </div>
                <span className="text-sm font-mono font-bold truncate" style={{ color: 'var(--text)' }}>{parsed.hash || '(None)'}</span>
              </div>

              {/* Pathname */}
              <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs sm:col-span-2" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>Pathname</span>
                  <CopyButton textToCopy={parsed.pathname || ''} size="sm" />
                </div>
                <span className="text-sm font-mono font-bold truncate select-all" style={{ color: 'var(--text)' }}>{parsed.pathname}</span>
              </div>

              {/* Origin */}
              <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs sm:col-span-2" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>Origin</span>
                  <CopyButton textToCopy={parsed.origin || ''} size="sm" />
                </div>
                <span className="text-sm font-mono font-bold truncate select-all" style={{ color: 'var(--text)' }}>{parsed.origin}</span>
              </div>

              {/* Username & Password (if present) */}
              {(parsed.username || parsed.password) && (
                <div className="p-4 rounded-2xl flex flex-col justify-between gap-2 shadow-xs sm:col-span-2 lg:col-span-4" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
                    Authentication Credentials (Embedded)
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span>User: <strong>{parsed.username}</strong></span>
                    <span>Password: <strong>{parsed.password}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Query Parameters Table */}
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                  Query Parameters ({parsed.params.length} Params)
                </h3>
                <CopyButton textToCopy={parsed.search || ''} size="sm" label="Copy Query String" />
              </div>

              {parsed.params.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-c)', color: 'var(--muted)' }}>
                        <th className="pb-2.5 font-bold">Key (Name)</th>
                        <th className="pb-2.5 font-bold">Decoded Value</th>
                        <th className="pb-2.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-c)]">
                      {parsed.params.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[var(--surface-2)]">
                          <td className="py-2.5 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                            {p.key}
                          </td>
                          <td className="py-2.5 font-mono select-all" style={{ color: 'var(--text)' }}>
                            {p.value}
                          </td>
                          <td className="py-2.5 text-right">
                            <CopyButton textToCopy={p.value} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl text-center text-xs font-semibold" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                  No query parameters found in this URL.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ToolPageShell>
  );
}
