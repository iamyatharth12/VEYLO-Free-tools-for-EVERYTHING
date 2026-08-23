'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { getAllCategories, getAllTools } from '@/lib/registry';
import { ToolCard, Breadcrumbs } from '@/components/tool-ui';

export default function ToolsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => getAllCategories(), []);
  const allTools = useMemo(() => getAllTools(), []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on search, category, and status
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allTools.filter(tool => {
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      if (statusFilter === 'available' && tool.status !== 'available') {
        return false;
      }
      if (!q) return true;

      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.shortDescription.toLowerCase().includes(q);
      const slugMatch = tool.slug.toLowerCase().includes(q);
      const kwMatch = tool.keywords?.some(k => k.toLowerCase().includes(q));

      return nameMatch || descMatch || slugMatch || kwMatch;
    });
  }, [allTools, searchQuery, selectedCategory, statusFilter]);

  const liveCount = useMemo(() => allTools.filter(t => t.status === 'available').length, [allTools]);
  const totalCount = allTools.length;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-6 animate-fade-in px-4">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ name: 'Tools Directory' }]} />

      {/* Directory Hero Header */}
      <header className="flex flex-col gap-3 text-center max-w-3xl mx-auto items-center">
        <span
          className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)', color: 'var(--accent)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--green, #10b981)' }} aria-hidden="true" />
          Tool Directory
        </span>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
          Explore All <span style={{ color: 'var(--accent)' }}>VEYLO</span> Tools
        </h1>

        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
          Fast, free browser-based tools for hardware testing, diagnostics, calculators, converters, and developers. 100% client-side privacy.
        </p>
      </header>

      {/* Search & Filter Bar */}
      <div
        className="p-5 rounded-2xl flex flex-col gap-4 sticky top-16 z-30 shadow-sm"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, keyword, or function... (Press '/' to focus)"
              aria-label="Search tools"
              className="w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-c)',
              }}
            />
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-50 select-none pointer-events-none"
              aria-hidden="true"
            >
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-c)' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Toggle */}
          <div
            className="flex items-center p-1 rounded-xl flex-shrink-0"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-c)' }}
            role="group"
            aria-label="Status filter"
          >
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background: statusFilter === 'all' ? 'var(--surface)' : 'transparent',
                color: statusFilter === 'all' ? 'var(--text)' : 'var(--muted)',
              }}
            >
              All Tools ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('available')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'available' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                background: statusFilter === 'available' ? 'var(--surface)' : 'transparent',
                color: statusFilter === 'available' ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              Live Only ({liveCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none" role="tablist" aria-label="Tool categories">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
              selectedCategory === 'all' ? 'shadow' : 'hover:border-[var(--accent)]'
            }`}
            style={{
              background: selectedCategory === 'all' ? 'var(--accent)' : 'var(--surface-2)',
              color: selectedCategory === 'all' ? '#ffffff' : 'var(--muted)',
              border: selectedCategory === 'all' ? '1px solid var(--accent)' : '1px solid var(--border-c)',
            }}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const countInCat = allTools.filter(t => t.category === cat.id && (statusFilter === 'all' || t.status === 'available')).length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 flex-shrink-0 ${
                  isSelected ? 'shadow' : 'hover:border-[var(--accent)]'
                }`}
                style={{
                  background: isSelected ? 'var(--accent)' : 'var(--surface-2)',
                  color: isSelected ? '#ffffff' : 'var(--text)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-c)',
                }}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span>{cat.shortName}</span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-mono"
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--surface)',
                    color: isSelected ? '#ffffff' : 'var(--muted)',
                  }}
                >
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--muted)' }}>
        <span>
          Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Tools Grid / Empty State */}
      {filteredTools.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div
          className="p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-3 my-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-c)' }}
        >
          <span className="text-4xl" aria-hidden="true">🔍</span>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            No tools found matching your criteria
          </h2>
          <p className="text-xs max-w-md" style={{ color: 'var(--muted)' }}>
            Try searching for a different keyword, clearing your filters, or browsing by category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
