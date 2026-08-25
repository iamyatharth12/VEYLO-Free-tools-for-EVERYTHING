<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# VEYLO Platform Development Rules & Standards

Every tool on VEYLO must feel like an organic part of the unified platform, not an isolated mini-website. Quality > quantity.

## Core Rules for Every Tool:
1. **Shared Design System**: Built exclusively with the shared `ToolPageShell`, `ToolHeader`, `ToolCard`, `ToolInput`, `ToolOutput`, `CopyButton`, `ResetButton`, `ActionButtons`, `FAQSection`, and `RelatedTools` UI architecture.
2. **Central Tool Registry**: Every tool must be registered in `src/lib/registry/tools.ts` with complete metadata (slug, name, category, icon, status, relatedTools, seoTitle, seoDescription).
3. **Discoverability**: Must appear dynamically in `/tools` directory with working category filter badges and live search.
4. **Unique SEO Metadata**: Every tool must have its own `layout.tsx` containing unique, descriptive `Metadata` (title, description, keywords, OpenGraph, Twitter card) and valid JSON-LD schemas (`BreadcrumbList` and `WebApplication`).
5. **Canonical URLs**: Every layout must declare its exact canonical URL (`https://veylo-free-tools-for-everything.vercel.app/<slug>`).
6. **Platform Cross-Linking**: Must cross-link to at least 3 relevant VEYLO tools via `<RelatedTools />`.
7. **Mobile Responsiveness**: Must render cleanly on mobile viewports (320px+), tablets, and ultra-wide displays without horizontal overflow or cramped touch targets.
8. **Accessibility & Semantics**: Proper `<label>` elements for inputs, descriptive `aria` attributes, keyboard accessibility, and standard semantic HTML5 hierarchy (one `<h1>` per page).
9. **Zero Authentication**: All tools must work instantly without login, signup, accounts, or paywalls.
10. **Zero Unnecessary Backend**: All utilities must execute 100% client-side in the browser using deterministic algorithms and Web Crypto API. No external AI API keys, no serverless roundtrips, no privacy leaks.
11. **No Keyword Stuffing**: Informational copy and SEO sections must be clear, concise, well-structured, and genuinely educational.
12. **Real Utility**: No placeholder mockups or fake outputs.
13. **Clean Code & Lint**: Must pass `npm run lint` with 0 errors and 0 warnings.
14. **Production Build**: Must pass `npm run build` and prerender as clean static HTML.
