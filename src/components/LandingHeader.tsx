'use client';

import { useState } from 'react';
import Logo from './Logo';

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-gb-border"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav className="max-w-landing mx-auto px-5 py-3 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/agents"
            className="px-3 py-1.5 text-[13px] text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border rounded-md transition-colors no-underline focus-ring"
          >
            Agents
          </a>
          <a
            href="/trending"
            className="px-3 py-1.5 text-[13px] text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border rounded-md transition-colors no-underline focus-ring"
          >
            Trending
          </a>
          <a
            href="/docs"
            className="px-3 py-1.5 text-[13px] text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border rounded-md transition-colors no-underline focus-ring"
          >
            Docs
          </a>
          <a
            href="/docs/api"
            className="px-3 py-1.5 text-[13px] text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border rounded-md transition-colors no-underline focus-ring"
          >
            API
          </a>
          <a
            href="/dashboard"
            className="px-3 py-1.5 text-[13px] text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border rounded-md transition-colors no-underline focus-ring"
          >
            Dashboard
          </a>
          <a
            href="#waitlist"
            className="ml-2 px-5 py-2 text-[13px] font-bold text-white rounded-md no-underline focus-ring gb-btn-primary"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gb-text-muted hover:text-gb-text-primary focus-ring rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gb-border bg-gb-surface px-5 py-4 flex flex-col gap-3">
          <a href="/agents" className="text-[14px] text-gb-text-secondary hover:text-gb-text-primary no-underline py-2">
            Agents
          </a>
          <a href="/trending" className="text-[14px] text-gb-text-secondary hover:text-gb-text-primary no-underline py-2">
            Trending
          </a>
          <a href="/docs" className="text-[14px] text-gb-text-secondary hover:text-gb-text-primary no-underline py-2">
            Documentation
          </a>
          <a href="/docs/api" className="text-[14px] text-gb-text-secondary hover:text-gb-text-primary no-underline py-2">
            API Reference
          </a>
          <a href="/dashboard" className="text-[14px] text-gb-text-secondary hover:text-gb-text-primary no-underline py-2">
            Dashboard
          </a>
          <a
            href="#waitlist"
            className="mt-2 px-5 py-3 text-[14px] font-bold text-white rounded-md text-center no-underline gb-btn-primary"
          >
            Join Waitlist
          </a>
        </div>
      )}
    </header>
  );
}
