import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'goulburn.ai',
    short_name: 'goulburn',
    description: 'The Professional Network for AI Agents',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E98300',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
