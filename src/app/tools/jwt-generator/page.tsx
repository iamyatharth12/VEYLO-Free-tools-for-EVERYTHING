'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

// UTF-8 safe base64url encoding
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const DEFAULT_HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2);

const DEFAULT_PAYLOAD = JSON.stringify(
  {
    sub: 'user_1234567890',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  },
  null,
  2
);

export default function JwtGeneratorPage() {
  const tool = useMemo(() => getToolBySlug('tools/jwt-generator')!, []);

  const [algorithm, setAlgorithm] = useState<'HS256' | 'none'>('HS256');
  const [headerJson, setHeaderJson] = useState<string>(DEFAULT_HEADER);
  const [payloadJson, setPayloadJson] = useState<string>(DEFAULT_PAYLOAD);
  const [secretKey, setSecretKey] = useState<string>('your-256-bit-secret-key-veylo');

  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Generate cryptographically signed JWT via Web Crypto API
  const generateJwt = useCallback(async () => {
    setError(null);
    try {
      // Validate JSON
      JSON.parse(headerJson);
      JSON.parse(payloadJson);

      const encodedHeader = base64UrlEncode(headerJson.trim());
      const encodedPayload = base64UrlEncode(payloadJson.trim());
      const unsignedToken = `${encodedHeader}.${encodedPayload}`;

      if (algorithm === 'none') {
        setGeneratedToken(`${unsignedToken}.`);
        return;
      }

      // Sign with HS256 using Web Crypto API
      const encoder = new TextEncoder();
      const secretBytes = encoder.encode(secretKey || '');
      const key = await crypto.subtle.importKey(
        'raw',
        secretBytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const dataToSign = encoder.encode(unsignedToken);
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataToSign);
      const encodedSignature = bufferToBase64Url(signatureBuffer);

      setGeneratedToken(`${unsignedToken}.${encodedSignature}`);
    } catch (err) {
      setError(`Generation failed: ${(err as Error).message}. Please ensure JSON syntax is valid.`);
      setGeneratedToken('');
    }
  }, [headerJson, payloadJson, secretKey, algorithm]);

  useEffect(() => {
    generateJwt();
  }, [generateJwt]);

  const handleGenerateRandomSecret = () => {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    const secret = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
    setSecretKey(secret);
  };

  const handleApplyExpPreset = (hours: number) => {
    try {
      const parsed = JSON.parse(payloadJson);
      parsed.iat = Math.floor(Date.now() / 1000);
      parsed.exp = Math.floor(Date.now() / 1000) + hours * 3600;
      setPayloadJson(JSON.stringify(parsed, null, 2));
    } catch {
      // Ignore if currently invalid JSON
    }
  };

  const handleReset = () => {
    setHeaderJson(DEFAULT_HEADER);
    setPayloadJson(DEFAULT_PAYLOAD);
    setSecretKey('your-256-bit-secret-key-veylo');
    setAlgorithm('HS256');
  };

  const faqs: FAQItem[] = [
    {
      question: 'How does HMAC-SHA256 signing work in the browser?',
      answer:
        'The tool uses the standard Web Crypto API (`crypto.subtle.sign("HMAC", ...)`), natively available in all modern browsers. It signs the Base64Url `Header.Payload` string with your secret key using SHA-256, guaranteeing cryptographic integrity without external network requests.',
    },
    {
      question: 'Are generated JWT tokens safe to use in development?',
      answer:
        'Yes. As long as the receiving server shares the same HMAC secret key and validates the signature, these tokens are 100% compliant with RFC 7519 standards.',
    },
    {
      question: 'What is the "none" algorithm?',
      answer:
        'The `none` algorithm indicates an unsecured token with no signature (e.g. `header.payload.`). It is sometimes used in debugging but should NEVER be accepted on secure production servers.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Cryptographically Signed JSON Web Token (JWT) Generator
          </h2>
          <p>
            Create, sign, and test RFC 7519 JSON Web Tokens client-side with HMAC-SHA256 (HS256) cryptographic signing powered by the native Web Crypto API.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔐 Web Crypto HS256 Signing</h3>
              <p className="text-[11px]">Real cryptographic HMAC-SHA256 signature generation in local browser memory.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛠️ Payload Claims Editor</h3>
              <p className="text-[11px]">Customize sub, roles, and automated timestamp expirations (iat/exp).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 Zero Server Exposure</h3>
              <p className="text-[11px]">Secret keys and tokens are never transmitted across the network.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Output Generated Token Banner */}
        <div
          className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                Generated JSON Web Token (JWT)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                {algorithm === 'HS256' ? 'HS256 Signed' : 'Unsigned'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton textToCopy={generatedToken} size="sm" label="Copy JWT" />
              <ResetButton onClick={handleReset} />
            </div>
          </div>

          {error ? (
            <div className="p-3 rounded-xl text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              rows={3}
              value={generatedToken}
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none resize-y select-all break-all"
              style={{ background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--border-c)' }}
            />
          )}
        </div>

        {/* Algorithm & Secret Key Settings */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Signing Configuration
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Algorithm Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jwt-alg" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                Signing Algorithm
              </label>
              <select
                id="jwt-alg"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'HS256' | 'none')}
                className="p-3 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value="HS256">HS256 (HMAC with SHA-256)</option>
                <option value="none">none (Unsigned / Unsecured)</option>
              </select>
            </div>

            {/* Secret Key Input */}
            {algorithm === 'HS256' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="jwt-secret" className="text-xs font-bold" style={{ color: 'var(--text)' }}>
                    HMAC Secret Key
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomSecret}
                    className="text-[11px] text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    Random Key
                  </button>
                </div>
                <input
                  id="jwt-secret"
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret passphrase or key..."
                  className="w-full p-2.5 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Header & Payload JSON Editors */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Header Editor */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="header-json-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>
                Header (JSON)
              </label>
              <CopyButton textToCopy={headerJson} size="sm" />
            </div>

            <textarea
              id="header-json-input"
              rows={8}
              value={headerJson}
              onChange={(e) => setHeaderJson(e.target.value)}
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>

          {/* Payload Editor */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4 shadow-xs"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label htmlFor="payload-json-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Payload Claims (JSON)
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyExpPreset(1)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  +1h Exp
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyExpPreset(24)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  +24h Exp
                </button>
                <CopyButton textToCopy={payloadJson} size="sm" />
              </div>
            </div>

            <textarea
              id="payload-json-input"
              rows={8}
              value={payloadJson}
              onChange={(e) => setPayloadJson(e.target.value)}
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
