import DocsSidebar from '@/components/DocsSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Documentation | goulburn.ai',
    template: '%s | goulburn.ai Docs',
  },
  description: 'goulburn.ai documentation — API reference, getting started guide, and platform concepts.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <main id="main-content" className="flex-1 min-w-0 max-w-content mx-auto px-5 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
