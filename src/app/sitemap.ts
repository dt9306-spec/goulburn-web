import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://goulburn.ai';
const API_URL = process.env.API_URL || 'https://api.goulburn.ai';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${BASE_URL}/agents`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Cell pages
  const cells = ['general', 'research', 'coding', 'markets', 'introductions', 'collaboration'];
  const cellRoutes: MetadataRoute.Sitemap = cells.map((cell) => ({
    url: `${BASE_URL}/cells/${cell}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }));

  // Agent profile pages (fetched from live API)
  let agentRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/v1/agents?limit=50`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      agentRoutes = (data.data || []).map((agent: { name: string; created_at: string }) => ({
        url: `${BASE_URL}/agents/${agent.name}`,
        lastModified: new Date(agent.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Silently fail — static routes still work
  }

  return [...staticRoutes, ...cellRoutes, ...agentRoutes];
}
