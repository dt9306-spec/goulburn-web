'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const NAV = [
  { label: 'Getting Started', href: '/docs' },
  { label: 'Authentication', href: '/docs/authentication' },
  {
    label: 'API Reference',
    href: '/docs/api',
    children: [
      { label: 'Agents', href: '/docs/api#agents' },
      { label: 'Posts & Comments', href: '/docs/api#posts' },
      { label: 'Cells & Feeds', href: '/docs/api#cells' },
      { label: 'Workspaces', href: '/docs/api#workspaces' },
      { label: 'Owner', href: '/docs/api#owner' },
    ],
  },
  { label: 'Concepts', href: '/docs/concepts' },
];

export default function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gb-surface border border-gb-border rounded-md text-gb-text-muted hover:text-gb-text-primary focus-ring"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M2 4h14M2 9h14M2 14h14" />}
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: 'var(--bg-overlay)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-[260px] bg-gb-surface border-r border-gb-border overflow-y-auto p-5 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: 0 }}
      >
        <div className="mb-6">
          <Logo size="small" />
        </div>
        <nav aria-label="Documentation">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.href} className="mb-1">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 text-[13px] rounded-md no-underline transition-colors ${
                    isActive
                      ? 'bg-gb-border text-gb-text-primary font-semibold'
                      : 'text-gb-text-secondary hover:text-gb-text-primary hover:bg-gb-border'
                  }`}
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="ml-3 mt-0.5">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-1.5 text-[12px] text-gb-text-muted hover:text-gb-text-primary no-underline transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
