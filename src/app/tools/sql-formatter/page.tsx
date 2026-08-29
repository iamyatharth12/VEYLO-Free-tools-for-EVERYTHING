'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/registry';
import {
  ToolPageShell,
  CopyButton,
  ResetButton,
  FAQItem,
} from '@/components/tool-ui';

const SAMPLE_SQL = `select u.id, u.username, u.email, count(o.id) as total_orders, sum(o.amount) as revenue from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2025-01-01' group by u.id, u.username, u.email having count(o.id) > 5 order by revenue desc limit 20;`;

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
  'CROSS JOIN', 'FULL JOIN', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'DELETE', 'CREATE TABLE', 'ALTER TABLE',
  'DROP TABLE', 'UNION ALL', 'UNION', 'AS', 'IN', 'NOT IN', 'BETWEEN', 'LIKE', 'ILIKE', 'IS NULL',
  'IS NOT NULL', 'EXISTS', 'NOT EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'ALL',
  'ASC', 'DESC', 'WITH', 'BY', 'INTO', 'TABLE', 'DATABASE', 'SCHEMA', 'VIEW', 'INDEX', 'PRIMARY KEY',
  'FOREIGN KEY', 'REFERENCES', 'DEFAULT', 'CHECK', 'UNIQUE', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'COALESCE', 'NULLIF', 'ROUND', 'CAST', 'CONVERT'
];

function formatSql(query: string, indentSize: number | 'tab', uppercase: boolean): { formatted: string; minified: string } {
  if (!query.trim()) return { formatted: '', minified: '' };

  const indentStr = indentSize === 'tab' ? '\t' : ' '.repeat(indentSize);

  // Minified version
  const minified = query
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;()=><])\s*/g, '$1 ')
    .replace(/\s*,\s*/g, ', ')
    .trim();

  let formatted = query.trim();

  // Keyword Casing
  if (uppercase) {
    SQL_KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw);
    });
  }

  // Major Clause Line Breaks
  const majorClauses = [
    'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN',
    'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INSERT INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'WITH'
  ];

  majorClauses.forEach((clause) => {
    const regex = new RegExp(`\\s+(${clause})\\b`, 'gi');
    formatted = formatted.replace(regex, `\n$1`);
  });

  // AND / OR inside WHERE clauses
  formatted = formatted.replace(/\s+(AND|OR)\s+/gi, `\n${indentStr}$1 `);

  // Indent column lists after SELECT
  const lines = formatted.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // Check if line starts with a top-level clause
    const isTopClause = majorClauses.some((clause) =>
      trimmed.toUpperCase().startsWith(clause)
    );

    if (isTopClause) {
      return trimmed;
    } else {
      return `${indentStr}${trimmed}`;
    }
  });

  formatted = lines.join('\n').trim();

  return { formatted, minified };
}

export default function SqlFormatterPage() {
  const tool = useMemo(() => getToolBySlug('tools/sql-formatter')!, []);

  const [inputSql, setInputSql] = useState<string>(SAMPLE_SQL);
  const [indentSize, setIndentSize] = useState<number | 'tab'>(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'formatted' | 'minified'>('formatted');

  const { formatted, minified } = useMemo(() => {
    return formatSql(inputSql, indentSize, uppercaseKeywords);
  }, [inputSql, indentSize, uppercaseKeywords]);

  const activeOutput = viewMode === 'formatted' ? formatted : minified;

  const handleReset = () => {
    setInputSql('');
  };

  const faqs: FAQItem[] = [
    {
      question: 'Does this formatter execute my SQL queries?',
      answer:
        'No. This is strictly a text-formatting utility. It does not connect to any database (MySQL, PostgreSQL, SQLite, MS SQL, Oracle) and never executes SQL code.',
    },
    {
      question: 'Which SQL dialects are supported?',
      answer:
        'The formatter handles ANSI SQL standard syntax and is compatible with PostgreSQL, MySQL, MariaDB, SQLite, Microsoft SQL Server (T-SQL), Snowflake, BigQuery, and Oracle PL/SQL.',
    },
    {
      question: 'Why should SQL keywords be in UPPERCASE?',
      answer:
        'Uppercasing SQL keywords (SELECT, FROM, WHERE, JOIN) creates clear visual separation between the query engine’s commands and your database schema identifiers (tables, columns, aliases).',
    },
  ];

  return (
    <ToolPageShell
      tool={tool}
      faqs={faqs}
      seoSection={
        <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Client-Side SQL Query Formatter &amp; Prettifier
          </h2>
          <p>
            Format, beautify, and standardize unorganized SQL queries with uppercase keyword styling, custom clause indentation, and minification.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔠 Uppercase Keywords</h3>
              <p className="text-[11px]">Auto-capitalizes SELECT, FROM, WHERE, JOIN, and 60+ standard SQL terms.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>📐 Custom Clause Indentation</h3>
              <p className="text-[11px]">Breaks JOIN, GROUP BY, and AND/OR sub-clauses onto clean indented lines.</p>
            </div>
            <div className="p-3.5 rounded-xl flex flex-col gap-1" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}>
              <h3 className="font-bold text-xs" style={{ color: 'var(--text)' }}>🔒 100% Client-Side Privacy</h3>
              <p className="text-[11px]">Zero database connections. Queries never leave your browser memory.</p>
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
          {/* View Mode Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'formatted' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'formatted' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'formatted' ? '#fff' : 'var(--text)',
                border: viewMode === 'formatted' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              📄 Beautified SQL
            </button>
            <button
              type="button"
              onClick={() => setViewMode('minified')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'minified' ? 'shadow-xs' : 'hover:border-[var(--accent)]'
              }`}
              style={{
                background: viewMode === 'minified' ? 'var(--accent)' : 'var(--surface-2)',
                color: viewMode === 'minified' ? '#fff' : 'var(--text)',
                border: viewMode === 'minified' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
              }}
            >
              ⚡ Single Line (Minified)
            </button>
          </div>

          {/* Options */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none" style={{ color: 'var(--text)' }}>
              <input
                type="checkbox"
                checked={uppercaseKeywords}
                onChange={(e) => setUppercaseKeywords(e.target.checked)}
                className="rounded text-[var(--accent)] cursor-pointer"
              />
              <span>UPPERCASE Keywords</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span style={{ color: 'var(--muted)' }}>Indent:</span>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
                className="p-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value="tab">Tab</option>
              </select>
            </div>
          </div>
        </div>

        {/* Input & Output Workspace */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label htmlFor="sql-input" className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                Input SQL Query
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputSql(SAMPLE_SQL)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-[var(--accent)] cursor-pointer"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--text)' }}
                >
                  Sample Query
                </button>
                <ResetButton onClick={handleReset} label="Clear" />
              </div>
            </div>

            <textarea
              id="sql-input"
              rows={12}
              value={inputSql}
              onChange={(e) => setInputSql(e.target.value)}
              placeholder="Paste raw or messy SQL query here..."
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />

            <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              <span>Chars: {inputSql.length}</span>
              <span>Lines: {inputSql ? inputSql.split('\n').length : 0}</span>
            </div>
          </div>

          {/* Output Box */}
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                {viewMode === 'formatted' ? 'Formatted SQL Output' : 'Minified SQL Query'}
              </span>
              <CopyButton textToCopy={activeOutput} size="sm" />
            </div>

            <textarea
              readOnly
              rows={12}
              value={activeOutput}
              placeholder="Formatted SQL output will appear here..."
              className="w-full p-4 rounded-xl text-xs font-mono leading-relaxed focus:outline-none resize-y select-all whitespace-pre"
              style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-c)' }}
            />

            <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--muted)' }}>
              <span>Chars: {activeOutput.length}</span>
              <span>Lines: {activeOutput ? activeOutput.split('\n').length : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
