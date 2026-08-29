'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

// UTF-8 safe base64url decoding
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyXzEyMzQ1Njc4OTAiLCJuYW1lIjoiQWxleCBNb3JnYW4iLCJlbWFpbCI6ImFsZXhAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJhZG1pbiIsImRldmVsb3BlciJdLCJpYXQiOjE3MDQwMDAwMDAsImV4cCI6MjIwNDAwMDAwMH0.' +
  'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export default function JwtDecoderPage() {
  const tool = useMemo(() => getToolBySlug('tools/jwt-decoder')!, []);

  const [jwtInput, setJwtInput] = useState<string>(SAMPLE_JWT);

  // Decode JWT Parts
  const decoded = useMemo(() => {
    const trimmed = jwtInput.trim();
    if (!trimmed) {
      return {
        valid: false,
        headerRaw: '',
        payloadRaw: '',
        signatureRaw: '',
        headerObj: null,
        payloadObj: null,
        headerFormatted: '',
        payloadFormatted: '',
        exp: null,
        iat: null,
        nbf: null,
        isExpired: false,
        error: null,
      };
    }

    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      return {
        valid: false,
        headerRaw: parts[0] || '',
        payloadRaw: parts[1] || '',
        signatureRaw: parts[2] || '',
        headerObj: null,
        payloadObj: null,
        headerFormatted: '',
        payloadFormatted: '',
        exp: null,
        iat: null,
        nbf: null,
        isExpired: false,
        error: 'Invalid JWT structure: A standard JWT must contain exactly 3 dot-separated parts (Header.Payload.Signature).',
      };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);

      let headerObj: Record<string, unknown> | null = null;
      let payloadObj: Record<string, unknown> | null = null;

      try {
        headerObj = JSON.parse(headerStr);
      } catch {
        // Raw string
      }

      try {
        payloadObj = JSON.parse(payloadStr);
      } catch {
        // Raw string
      }

      const nowSec = Math.floor(Date.now() / 1000);
      const exp = typeof payloadObj?.exp === 'number' ? payloadObj.exp : null;
      const iat = typeof payloadObj?.iat === 'number' ? payloadObj.iat : null;
      const nbf = typeof payloadObj?.nbf === 'number' ? payloadObj.nbf : null;

      const isExpired = exp !== null ? exp < nowSec : false;

      return {
        valid: true,
        headerRaw: parts[0],
        payloadRaw: parts[1],
        signatureRaw: parts[2],
        headerObj,
        payloadObj,
        headerFormatted: headerObj ? JSON.stringify(headerObj, null, 2) : headerStr,
        payloadFormatted: payloadObj ? JSON.stringify(payloadObj, null, 2) : payloadStr,
        exp,
        iat,
        nbf,
        isExpired,
        error: null,
      };
    } catch (err) {
      return {
        valid: false,
        headerRaw: parts[0] || '',
        payloadRaw: parts[1] || '',
        signatureRaw: parts[2] || '',
        headerObj: null,
        payloadObj: null,
        headerFormatted: '',
        payloadFormatted: '',
        exp: null,
        iat: null,
        nbf: null,
        isExpired: false,
        error: `Base64 decoding failed: ${(err as Error).message}`,
      };
    }
  }, [jwtInput]);

  const formatTimestamp = (sec: number | null) => {
    if (sec === null) return 'Not Present';
    const date = new Date(sec * 1000);
    return `${date.toUTCString()} (Local: ${date.toLocaleString()})`;
  };

  const handleReset = () => {
    setJwtInput('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'Is decoding a JWT the same as verifying a JWT?',
      answer:
        'No. Decoding simply translates the Base64Url string into readable JSON format. Verification requires checking the cryptographic signature against the secret key (for HMAC algorithms like HS256) or public key (for RSA/ECDSA algorithms like RS256) to ensure the token has not been tampered with.',
    },
    {
      question: 'Are my tokens sent to any external server?',
      answer:
        'Never. VEYLO processes all tokens 100% client-side in your local browser JavaScript runtime. No tokens, headers, or signatures are logged or transmitted.',
    },
    {
      question: 'What are standard JWT claims like exp, iat, and nbf?',
      answer:
        '• exp (Expiration Time): The Unix timestamp after which the JWT must not be accepted.\n• iat (Issued At): The timestamp when the token was generated.\n• nbf (Not Before): The timestamp before which the token is not valid.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Client-Side JSON Web Token (JWT) Inspector &amp; Claims Analyzer
          </h2>
          <p>
            Decode, inspect, and debug JWT tokens instantly in your browser without exposing sensitive authentication tokens or API credentials to remote servers.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 100% Client-Side Privacy</h3>
              <p className="text-[11px]">Tokens are parsed in memory using standard UTF-8 TextDecoder.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>⏳ Expiration Tracking</h3>
              <p className="text-[11px]">Automatic conversion of exp, iat, and nbf into UTC and local dates.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ Security Notice</h3>
              <p className="text-[11px]">Clear reminder that decoding is not cryptographic signature verification.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Security Alert Banner */}
        <div
          className="p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed"
          style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#d97706' }}
        >
          <span className="text-lg shrink-0">⚠️</span>
          <div>
            <strong>Important Security Notice:</strong> Decoding a JWT is <strong>NOT</strong> verification. Anyone can decode and view claims without a secret key. Never paste production database passwords or sensitive private keys into untrusted environments.
          </div>
        </div>

        {/* Input Area */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="jwt-input-field" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
              Paste JSON Web Token (JWT)
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJwtInput(SAMPLE_JWT)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
              >
                Load Sample JWT
              </button>
              <ResetButton onClick={handleReset} label="Clear" />
            </div>
          </div>

          <textarea
            id="jwt-input-field"
            rows={4}
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            placeholder="Paste your encoded JWT string (e.g. eyJhbGciOi...)"
            className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y break-all"
            style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
          />

          {decoded.error && (
            <div className="p-3 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20">
              {decoded.error}
            </div>
          )}
        </div>

        {/* Decoded Output Grid */}
        {decoded.valid && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Header Box */}
            <div
              className="p-6 rounded-2xl flex flex-col justify-between gap-4 shadow-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>
                    Header (Algorithm &amp; Token Type)
                  </span>
                </div>
                <CopyButton textToCopy={decoded.headerFormatted} size="sm" />
              </div>

              <pre
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto select-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                {decoded.headerFormatted}
              </pre>
            </div>

            {/* Payload Box */}
            <div
              className="p-6 rounded-2xl flex flex-col justify-between gap-4 shadow-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                    Payload (Claims Data)
                  </span>
                </div>
                <CopyButton textToCopy={decoded.payloadFormatted} size="sm" />
              </div>

              <pre
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto select-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                {decoded.payloadFormatted}
              </pre>
            </div>

            {/* Timestamps & Claims Status */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs lg:col-span-2"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Decoded Timestamps &amp; Validity
              </span>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Exp */}
                <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Expiration (exp)</span>
                    {decoded.exp !== null && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          background: decoded.isExpired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: decoded.isExpired ? '#ef4444' : 'var(--green, #10b981)',
                        }}
                      >
                        {decoded.isExpired ? 'Expired' : 'Active'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                    {formatTimestamp(decoded.exp)}
                  </span>
                </div>

                {/* Iat */}
                <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Issued At (iat)</span>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                    {formatTimestamp(decoded.iat)}
                  </span>
                </div>

                {/* Nbf */}
                <div className="p-4 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Not Before (nbf)</span>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                    {formatTimestamp(decoded.nbf)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Box */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-3 shadow-xs lg:col-span-2"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green, #10b981)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                    Signature (Encoded Hash)
                  </span>
                </div>
                <CopyButton textToCopy={decoded.signatureRaw} size="sm" />
              </div>

              <div
                className="p-3.5 rounded-xl font-mono text-xs break-all select-all"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border-c)' }}
              >
                {decoded.signatureRaw}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
