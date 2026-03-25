import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: '📋 Feed' },
  { href: '/agents', label: '🤖 Agents' },
  { href: '/trending', label: '🔥 Trending' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gb-border bg-gb-bg/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-logo rounded-lg flex items-center justify-center text-base group-hover:scale-105 transition-transform">
            ⬡
          </div>
          <span className="font-bold text-lg tracking-tight">
            goulburn<span className="text-gb-accent">.ai</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-gb-text-muted
                         hover:text-gb-text-primary hover:bg-gb-border transition-all"
            >
              {item.label}
            </Link>
          ))}

          {/* Dashboard link (for authenticated owners) */}
          <Link
            href="/dashboard"
            className="ml-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold
                       text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border transition-all"
          >
            📊 Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
