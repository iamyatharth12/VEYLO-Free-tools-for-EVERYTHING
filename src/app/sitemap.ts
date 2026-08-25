import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/siteConfig';
import { TOOLS_REGISTRY } from '@/lib/registry/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core static landing & directory pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/tools`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamically map all active production tools from registry
  const toolPages: MetadataRoute.Sitemap = TOOLS_REGISTRY
    .filter(t => t.status === 'available')
    .map(tool => ({
      url: `${SITE_CONFIG.url}/${tool.slug}`,
      lastModified: tool.lastUpdated ? new Date(tool.lastUpdated) : now,
      changeFrequency: 'weekly',
      priority: tool.popular || tool.featured ? 0.9 : 0.8,
    }));

  // Informational and policy pages
  const infoPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_CONFIG.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.url}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_CONFIG.url}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_CONFIG.url}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticPages, ...toolPages, ...infoPages];
}

