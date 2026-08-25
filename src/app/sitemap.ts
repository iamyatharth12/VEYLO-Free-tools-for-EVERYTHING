import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/tools',
    '/mouse-tester',
    '/mouse-click-test',
    '/double-click-test',
    '/mouse-scroll-test',
    '/mouse-polling-rate-test',
    '/mouse-dpi-test',
    '/cps-test',
    '/random-number-generator',
    '/random-word-generator',
    '/username-generator',
    '/random-letter-generator',
    '/coin-flip',
    '/dice-roller',
    '/yes-or-no',
    '/random-choice-picker',
    '/team-generator',
    '/truth-or-dare',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ];



  const now = new Date();

  return routes.map(route => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : route === '/mouse-tester' ? 0.9 : 0.8,
  }));
}

