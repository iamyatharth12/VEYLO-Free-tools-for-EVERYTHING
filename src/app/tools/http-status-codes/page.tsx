'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

interface StatusCode {
  code: number;
  phrase: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  rfc: string;
  summary: string;
  description: string;
  troubleshooting: string;
}

const HTTP_STATUS_DATABASE: StatusCode[] = [
  // 1xx Informational
  {
    code: 100,
    phrase: 'Continue',
    category: '1xx',
    rfc: 'RFC 9110 §15.2.1',
    summary: 'The server has received the request headers and the client should proceed to send the request body.',
    description: 'Used with the Expect: 100-continue header to avoid sending large request bodies if headers are rejected.',
    troubleshooting: 'Client should proceed with the rest of the HTTP payload.',
  },
  {
    code: 101,
    phrase: 'Switching Protocols',
    category: '1xx',
    rfc: 'RFC 9110 §15.2.2',
    summary: 'The requester has asked the server to switch protocols (e.g. HTTP to WebSocket).',
    description: 'Sent in response to an Upgrade request header from the client to establish a persistent WebSocket connection.',
    troubleshooting: 'Standard response during WebSocket handshakes.',
  },
  {
    code: 102,
    phrase: 'Processing',
    category: '1xx',
    rfc: 'RFC 2518 (WebDAV)',
    summary: 'The server has received and is processing the request, but no response is available yet.',
    description: 'Prevents client timeout during long-running WebDAV operations.',
    troubleshooting: 'Wait for the final response code.',
  },
  {
    code: 103,
    phrase: 'Early Hints',
    category: '1xx',
    rfc: 'RFC 8297',
    summary: 'Used to return preliminary response headers before final HTTP message is ready.',
    description: 'Allows browser to preload critical CSS/JS assets while server is still rendering HTML.',
    troubleshooting: 'Ensure Link headers in 103 match resources required on the final page.',
  },

  // 2xx Success
  {
    code: 200,
    phrase: 'OK',
    category: '2xx',
    rfc: 'RFC 9110 §15.3.1',
    summary: 'Standard response for successful HTTP requests.',
    description: 'The meaning depends on the HTTP method: GET has fetched data, POST has transmitted payload, PUT has updated resource.',
    troubleshooting: 'Normal operating behavior. No action needed.',
  },
  {
    code: 201,
    phrase: 'Created',
    category: '2xx',
    rfc: 'RFC 9110 §15.3.2',
    summary: 'The request has been fulfilled, resulting in the creation of a new resource.',
    description: 'Typical response following POST or PUT requests. The Location header typically points to the newly created item.',
    troubleshooting: 'Inspect the Location header or response body for new resource ID.',
  },
  {
    code: 202,
    phrase: 'Accepted',
    category: '2xx',
    rfc: 'RFC 9110 §15.3.3',
    summary: 'The request has been accepted for processing, but processing has not completed.',
    description: 'Used for asynchronous background jobs and batch processing queues.',
    troubleshooting: 'Poll the status endpoint or wait for a webhook callback.',
  },
  {
    code: 204,
    phrase: 'No Content',
    category: '2xx',
    rfc: 'RFC 9110 §15.3.5',
    summary: 'The server successfully processed the request, but is not returning any content in the response body.',
    description: 'Commonly used for DELETE actions or PUT updates where returning updated state is unnecessary.',
    troubleshooting: 'Do not expect or parse a JSON response body on 204.',
  },
  {
    code: 206,
    phrase: 'Partial Content',
    category: '2xx',
    rfc: 'RFC 9110 §15.3.7',
    summary: 'The server is delivering only part of the resource due to a Range header sent by the client.',
    description: 'Used for video/audio streaming scrubbing and resumable file downloads.',
    troubleshooting: 'Check Content-Range header to verify delivered byte offsets.',
  },

  // 3xx Redirection
  {
    code: 301,
    phrase: 'Moved Permanently',
    category: '3xx',
    rfc: 'RFC 9110 §15.4.2',
    summary: 'The target resource has been assigned a new permanent URI.',
    description: 'Search engines pass SEO link juice to the new URL specified in the Location header.',
    troubleshooting: 'Update bookmarks, links, and API client targets to the new URL.',
  },
  {
    code: 302,
    phrase: 'Found (Temporary Redirect)',
    category: '3xx',
    rfc: 'RFC 9110 §15.4.3',
    summary: 'The target resource resides temporarily under a different URI.',
    description: 'Client should continue to use the original URI for future requests.',
    troubleshooting: 'Temporary redirection. Search engines will not transfer page rank.',
  },
  {
    code: 304,
    phrase: 'Not Modified',
    category: '3xx',
    rfc: 'RFC 9110 §15.4.5',
    summary: 'Tells the client that the cached copy is still fresh and can be reused.',
    description: 'Triggered by conditional GET headers: If-Modified-Since or If-None-Match (ETag).',
    troubleshooting: 'Client should load resource from local browser cache.',
  },
  {
    code: 307,
    phrase: 'Temporary Redirect',
    category: '3xx',
    rfc: 'RFC 9110 §15.4.8',
    summary: 'Temporary redirect that guarantees the HTTP method will not be changed (e.g. POST remains POST).',
    description: 'Unlike legacy 302, user agents MUST NOT change the request method from POST to GET.',
    troubleshooting: 'Verify client repeats the original HTTP method on the redirect target.',
  },
  {
    code: 308,
    phrase: 'Permanent Redirect',
    category: '3xx',
    rfc: 'RFC 9110 §15.4.9',
    summary: 'Permanent redirect that guarantees the HTTP method will not be changed.',
    description: 'Unlike 301, method and body are preserved across the redirect.',
    troubleshooting: 'Update API endpoint configurations permanently.',
  },

  // 4xx Client Errors
  {
    code: 400,
    phrase: 'Bad Request',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.1',
    summary: 'The server cannot process the request due to perceived client error (malformed syntax, invalid JSON, deceptive routing).',
    description: 'Most common cause: invalid JSON body, missing required fields, or unparseable headers.',
    troubleshooting: 'Validate request payload structure, schema types, and header syntax.',
  },
  {
    code: 401,
    phrase: 'Unauthorized',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.2',
    summary: 'Authentication is required and has failed or has not yet been provided.',
    description: 'The response MUST include a WWW-Authenticate header field containing a challenge.',
    troubleshooting: 'Provide a valid Bearer token, API Key, or Authorization header.',
  },
  {
    code: 403,
    phrase: 'Forbidden',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.4',
    summary: 'The server understands the request, but refuses to authorize it.',
    description: 'Unlike 401, authentication is known but the identity lacks sufficient permissions/roles.',
    troubleshooting: 'Check user permissions, RBAC roles, IP whitelist, or CORS restrictions.',
  },
  {
    code: 404,
    phrase: 'Not Found',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.5',
    summary: 'The origin server did not find a current representation for the target resource.',
    description: 'Most common HTTP error. The URL path does not match any route or database record.',
    troubleshooting: 'Verify spelling of URL path, query params, and API route mappings.',
  },
  {
    code: 405,
    phrase: 'Method Not Allowed',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.6',
    summary: 'The HTTP method in the request is known but not supported by the target resource.',
    description: 'For example, sending a POST request to an endpoint that only handles GET.',
    troubleshooting: 'Check the Allow header for allowed HTTP verbs (e.g. Allow: GET, HEAD).',
  },
  {
    code: 408,
    phrase: 'Request Timeout',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.9',
    summary: 'The server did not receive a complete request message within the time that it was prepared to wait.',
    description: 'Occurs when client connection stalls while uploading large bodies.',
    troubleshooting: 'Retry request with a faster connection or adjust client upload stream timeouts.',
  },
  {
    code: 409,
    phrase: 'Conflict',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.10',
    summary: 'The request could not be completed due to a conflict with current resource state.',
    description: 'Common in version control conflicts or attempting to register an already taken email/username.',
    troubleshooting: 'Resolve data state conflict, refresh resource version, or retry with unique identifiers.',
  },
  {
    code: 410,
    phrase: 'Gone',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.11',
    summary: 'The target resource is no longer available at the origin server and no forwarding address is known.',
    description: 'Used when a resource has been intentionally removed and search engines should de-index it immediately.',
    troubleshooting: 'Remove all references and links to this permanently deleted resource.',
  },
  {
    code: 418,
    phrase: "I'm a Teapot",
    category: '4xx',
    rfc: 'RFC 2324 (HTCPCP)',
    summary: 'April Fools joke standard: Any attempt to brew coffee with a teapot should result in error 418.',
    description: 'Widely implemented across web frameworks as an Easter egg status code.',
    troubleshooting: 'Brew tea instead of coffee.',
  },
  {
    code: 422,
    phrase: 'Unprocessable Content (Entity)',
    category: '4xx',
    rfc: 'RFC 9110 §15.5.21',
    summary: 'The request was well-formed but contained semantic errors (e.g. failed validation schema).',
    description: 'Standard error code in REST APIs when payload JSON is syntactically valid but field values fail validation rules.',
    troubleshooting: 'Inspect response error body for specific field validation failures.',
  },
  {
    code: 429,
    phrase: 'Too Many Requests',
    category: '4xx',
    rfc: 'RFC 6585 §4',
    summary: 'The user has sent too many requests in a given amount of time (Rate Limited).',
    description: 'Servers typically include Retry-After header indicating how many seconds to wait before retrying.',
    troubleshooting: 'Implement exponential backoff and respect Retry-After header.',
  },

  // 5xx Server Errors
  {
    code: 500,
    phrase: 'Internal Server Error',
    category: '5xx',
    rfc: 'RFC 9110 §15.6.1',
    summary: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
    description: 'Generic catch-all error thrown when backend application code crashes or throws an unhandled exception.',
    troubleshooting: 'Inspect backend application server logs and stack traces for uncaught exceptions.',
  },
  {
    code: 501,
    phrase: 'Not Implemented',
    category: '5xx',
    rfc: 'RFC 9110 §15.6.2',
    summary: 'The server does not support the functionality required to fulfill the request.',
    description: 'Returned when the server does not recognize the HTTP request method.',
    troubleshooting: 'Implement required handler or use a supported HTTP method.',
  },
  {
    code: 502,
    phrase: 'Bad Gateway',
    category: '5xx',
    rfc: 'RFC 9110 §15.6.3',
    summary: 'The server, while acting as a gateway or proxy, received an invalid response from upstream.',
    description: 'Occurs when Nginx/Cloudflare proxy fails to communicate with Node.js/PHP backend service.',
    troubleshooting: 'Verify backend process (Node.js/Gunicorn/PHP-FPM) is running and listening on specified port/socket.',
  },
  {
    code: 503,
    phrase: 'Service Unavailable',
    category: '5xx',
    rfc: 'RFC 9110 §15.6.4',
    summary: 'The server is currently unable to handle the request due to a temporary overload or maintenance.',
    description: 'Often temporary. Servers can send Retry-After header indicating maintenance downtime.',
    troubleshooting: 'Check server CPU/RAM utilization and database connection pool saturation.',
  },
  {
    code: 504,
    phrase: 'Gateway Timeout',
    category: '5xx',
    rfc: 'RFC 9110 §15.6.5',
    summary: 'The proxy server did not receive a timely response from the upstream backend server.',
    description: 'Backend took too long to complete heavy database queries or long-running computations.',
    troubleshooting: 'Optimize slow SQL queries, increase proxy timeout caps, or convert heavy requests into async background jobs.',
  },
];

export default function HttpStatusCodesPage() {
  const tool = useMemo(() => getToolBySlug('tools/http-status-codes')!, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | '1xx' | '2xx' | '3xx' | '4xx' | '5xx'>('all');

  const filteredCodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return HTTP_STATUS_DATABASE.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      const codeMatch = String(item.code).includes(q);
      const phraseMatch = item.phrase.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const summaryMatch = item.summary.toLowerCase().includes(q);

      return codeMatch || phraseMatch || descMatch || summaryMatch;
    });
  }, [searchQuery, selectedCategory]);

  const getCategoryColor = (cat: StatusCode['category']) => {
    switch (cat) {
      case '1xx': return '#3b82f6';
      case '2xx': return 'var(--green, #10b981)';
      case '3xx': return '#8b5cf6';
      case '4xx': return '#f59e0b';
      case '5xx': return '#ef4444';
    }
  };

  const faqs: FAQItem[] = [
    {
      question: 'What are the 5 major HTTP status code classes?',
      answer:
        '• 1xx (Informational): Request received, continuing process.\n• 2xx (Success): Action successfully received, understood, and accepted.\n• 3xx (Redirection): Further action must be taken to complete request.\n• 4xx (Client Error): Request contains bad syntax or cannot be fulfilled.\n• 5xx (Server Error): Server failed to fulfill an apparently valid request.',
    },
    {
      question: 'What is the difference between 401 Unauthorized and 403 Forbidden?',
      answer:
        '401 Unauthorized means authentication is required (the server does not know who you are). 403 Forbidden means the user is authenticated, but does not have permission to access the requested resource.',
    },
    {
      question: 'What is the difference between 301 and 302 redirects?',
      answer:
        '301 Moved Permanently tells search engines and browsers that the page has permanently changed address and passes SEO link equity. 302 Found is a temporary redirect where search engines keep the original URL indexed.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Complete HTTP Status Code Directory &amp; Debugging Guide
          </h2>
          <p>
            Lookup standard IETF and RFC HTTP response status codes with official definitions, common root causes, and troubleshooting fixes for web developers and API designers.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔍 Instant Code Search</h3>
              <p className="text-[11px]">Filter status codes by numeric digits (e.g. 404) or keywords (e.g. Gateway).</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📚 Official RFC References</h3>
              <p className="text-[11px]">Includes RFC 9110 HTTP Semantics specifications and standard reason phrases.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛠️ Troubleshooting Fixes</h3>
              <p className="text-[11px]">Actionable advice on resolving server crashes, CORS issues, and rate limits.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Search & Category Filter Bar */}
        <div
          className="p-6 rounded-2xl flex flex-col gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code (e.g. 404) or keyword (e.g. Timeout)..."
                className="w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
            {searchQuery && <ResetButton onClick={() => setSearchQuery('')} label="Clear Search" />}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', '1xx', '2xx', '3xx', '4xx', '5xx'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat ? 'shadow-xs' : 'hover:border-[var(--accent)]'
                }`}
                style={{
                  background: selectedCategory === cat ? 'var(--accent)' : 'var(--surface-2)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text)',
                  border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                {cat === 'all' ? 'All Codes' : `${cat} (${cat === '1xx' ? 'Info' : cat === '2xx' ? 'Success' : cat === '3xx' ? 'Redirect' : cat === '4xx' ? 'Client Error' : 'Server Error'})`}
              </button>
            ))}
          </div>
        </div>

        {/* Status Codes Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredCodes.map((item) => {
            const catColor = getCategoryColor(item.category);
            return (
              <div
                key={item.code}
                className="p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xs transition-all hover:border-[var(--accent)]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="px-2.5 py-1 rounded-xl text-base font-black font-mono shadow-xs"
                        style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40` }}
                      >
                        {item.code}
                      </span>
                      <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                        {item.phrase}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--muted)]">{item.rfc}</span>
                  </div>

                  <p className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                    {item.summary}
                  </p>

                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {item.description}
                  </p>
                </div>

                <div
                  className="p-2.5 rounded-xl flex items-center justify-between gap-2 text-[11px]"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                >
                  <span className="truncate">💡 <strong>Fix:</strong> {item.troubleshooting}</span>
                  <CopyButton textToCopy={`${item.code} ${item.phrase}`} size="sm" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredCodes.length === 0 && (
          <div
            className="p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>No matching HTTP status codes found.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
            >
              Reset search and filters
            </button>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
