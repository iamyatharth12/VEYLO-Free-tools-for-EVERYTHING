import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mousetester.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:             `${BASE_URL}/mouse-tester`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1.0,
    },
  ];
}
