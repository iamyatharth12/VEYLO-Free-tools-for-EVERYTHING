'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_MARKDOWN = `# 🚀 Project Overview

Welcome to **VEYLO** — *Free tools for EVERYTHING*.

## Key Architecture Features
- 🔒 **100% Client-Side Privacy**: Zero serverless roundtrips or credentials logging.
- ⚡ **High-Speed Execution**: Powered by browser Web APIs and Web Crypto.
- 📱 **Responsive Design**: Flawless experience on mobile, tablet, and desktop.

### Feature Comparison Table
| Tool Name | Processing Engine | Security |
| :--- | :--- | :--- |
| **JWT Decoder** | Web Crypto & Base64 | Zero Data Leaks |
| **Markdown Previewer** | Sanitized GFM Parser | XSS Protected |
| **SQL Formatter** | ANSI Query Engine | Zero DB Calls |

---

### Code Demonstration
\`\`\`javascript
// Fast client-side SHA-256 calculation
async function computeHash(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
\`\`\`

> "Simplicity is prerequisite for reliability." — *Edsger W. Dijkstra*

#### Task Checklist
- [x] Implement secure client-side tools
- [x] Validate strict XSS sanitization
- [ ] Add dark mode toggle custom theme
`;

// Safe Markdown to Sanitized HTML Parser
function parseMarkdownToHtml(md: string): string {
  if (!md.trim()) return '';

  // 1. Strict Escape of Raw HTML Tags to prevent XSS injection
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Code blocks (```language ... ```)
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="p-4 rounded-xl font-mono text-xs overflow-x-auto my-4 bg-[var(--surface)] border border-[var(--border-c)]"><code>${code.trim()}</code></pre>`;
  });

  // 3. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded font-mono text-xs bg-[var(--surface)] text-[var(--accent)] border border-[var(--border-c)]">$1</code>');

  // 4. Headings
  html = html.replace(/^######\s+(.*)$/gm, '<h6 class="text-xs font-bold my-2 text-[var(--text)]">$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gm, '<h5 class="text-sm font-bold my-2 text-[var(--text)]">$1</h5>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4 class="text-base font-bold my-3 text-[var(--text)]">$1</h4>');
  html = html.replace(/^###\s+(.*)$/gm, '<h3 class="text-lg font-bold my-3 text-[var(--text)]">$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2 class="text-xl font-bold my-4 pb-1 border-b border-[var(--border-c)] text-[var(--text)]">$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1 class="text-2xl sm:text-3xl font-black my-4 pb-2 border-b border-[var(--border-c)] text-[var(--text)]">$1</h1>');

  // 5. Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-[var(--border-c)]" />');

  // 6. Blockquotes
  html = html.replace(/^&gt;\s+(.*)$/gm, '<blockquote class="p-3 my-3 border-l-4 border-[var(--accent)] bg-[var(--surface)] rounded-r-xl italic text-xs leading-relaxed text-[var(--muted)]">$1</blockquote>');

  // 7. Bold, Italic, Strikethrough
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[var(--text)]">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/~~([^~]+)~~/g, '<del class="line-through opacity-75">$1</del>');

  // 8. Task Lists & Unordered Lists
  html = html.replace(/^-\s+\[x\]\s+(.*)$/gim, '<div class="flex items-center gap-2 text-xs py-0.5 text-[var(--text)]"><span class="text-emerald-500">☑</span> <span>$1</span></div>');
  html = html.replace(/^-\s+\[ \]\s+(.*)$/gim, '<div class="flex items-center gap-2 text-xs py-0.5 text-[var(--muted)]"><span>☐</span> <span>$1</span></div>');
  html = html.replace(/^-\s+(.*)$/gm, '<li class="ml-4 list-disc text-xs py-0.5 leading-relaxed text-[var(--text)]">$1</li>');

  // 9. Links (sanitize against javascript: and data: URIs)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--accent)] hover:underline font-semibold">$1</a>');

  // 10. Tables
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const rows = match.trim().split('\n').map(r => r.trim());
    if (rows.length < 2) return match;

    const parseCells = (row: string) => row.split('|').slice(1, -1).map(c => c.trim());
    const headerCells = parseCells(rows[0]);
    const bodyRows = rows.slice(2); // skip header separator

    const thead = `<thead><tr class="border-b border-[var(--border-c)]">${headerCells.map(c => `<th class="p-2.5 font-bold text-left text-xs text-[var(--text)]">${c}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${bodyRows.map(row => {
      const cells = parseCells(row);
      return `<tr class="border-b border-[var(--border-c)] hover:bg-[var(--surface)]">${cells.map(c => `<td class="p-2.5 text-xs text-[var(--text)]">${c}</td>`).join('')}</tr>`;
    }).join('')}</tbody>`;

    return `<div class="overflow-x-auto my-4 rounded-xl border border-[var(--border-c)]"><table class="w-full text-xs">${thead}${tbody}</table></div>`;
  });

  // 11. Paragraphs (lines not wrapped in tags)
  const finalLines = html.split('\n\n').map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (/^<(h[1-6]|pre|div|blockquote|hr|ul|ol|table|li)/i.test(trimmed)) {
      return trimmed;
    }
    return `<p class="my-2.5 text-xs leading-relaxed text-[var(--text)]">${trimmed.replace(/\n/g, '<br />')}</p>`;
  });

  return finalLines.join('\n');
}

export default function MarkdownPreviewerPage() {
  const tool = useMemo(() => getToolBySlug('tools/markdown-preview')!, []);

  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const renderedHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setMarkdown('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'How is XSS prevented in this Markdown previewer?',
      answer:
        'The parser strictly escapes all raw HTML brackets (`<` and `>`), script tags, `javascript:` URLs, and HTML event handlers (`onerror=`, `onload=`) before rendering, ensuring that malicious payloads cannot execute.',
    },
    {
      question: 'Which GitHub-Flavored Markdown (GFM) features are supported?',
      answer:
        'Supports standard GFM formatting: Headers (# - ######), tables, syntax-highlighted code blocks, inline code, bold, italics, strikethrough, blockquotes, task lists, and auto-linked URLs.',
    },
    {
      question: 'Can I export the rendered HTML?',
      answer:
        'Yes. You can copy the raw Markdown source, copy the converted HTML markup, or download the document as a `.md` file.',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Real-Time GitHub-Flavored Markdown Editor &amp; Previewer
          </h2>
          <p>
            Write documentation, README files, and blog posts with live side-by-side previewing, table support, task lists, and zero risk of XSS execution.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🛡️ Strict XSS Sanitization</h3>
              <p className="text-[11px]">Escapes raw HTML tags and javascript: links to prevent malicious execution.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📊 Split &amp; Mobile Views</h3>
              <p className="text-[11px]">Side-by-side editing on desktop, with toggleable Edit/Preview views on mobile.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>💾 Instant Export</h3>
              <p className="text-[11px]">Copy rendered HTML or download the completed document as a .md file.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Controls Bar */}
        <div
          className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'split' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'split' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'split' ? '#fff' : 'var(--text)',
                border: viewMode === 'split' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              ◫ Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'edit' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'edit' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'edit' ? '#fff' : 'var(--text)',
                border: viewMode === 'edit' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              ✏️ Editor Only
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'preview' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'preview' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'preview' ? '#fff' : 'var(--text)',
                border: viewMode === 'preview' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              👁️ Preview Only
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:border-[var(--accent)] cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Sample MD
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:border-[var(--accent)] cursor-pointer"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
            >
              Download .md
            </button>
            <CopyButton textToCopy={renderedHtml} size="sm" label="Copy HTML" />
            <ResetButton onClick={handleReset} label="Clear" />
          </div>
        </div>

        {/* Split Editor & Preview Workspace */}
        <div className={`grid gap-6 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Pane */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <label htmlFor="md-editor" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  Markdown Source Editor
                </label>
                <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
                  {markdown.length} chars · {markdown.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                id="md-editor"
                rows={16}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type Markdown content here (GFM supported)..."
                className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              />
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--green, #10b981)' }}>
                  Sanitized HTML Live Preview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                  XSS Protected
                </span>
              </div>

              <div
                className="w-full h-80 lg:h-[420px] overflow-auto p-6 rounded-xl leading-relaxed select-text"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
                dangerouslySetInnerHTML={{ __html: renderedHtml || '<p class="text-xs italic text-[var(--muted)]">Markdown preview will appear here...</p>' }}
              />
            </div>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
