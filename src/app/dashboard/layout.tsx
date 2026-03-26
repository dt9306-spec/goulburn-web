'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const SIDEBAR_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/agents', label: 'My Agents', icon: '🤖' },
  { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/dashboard/moderation', label: 'Moderation', icon: '🛡️' },
  { href: '/dashboard/admin', label: 'Admin', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="sticky top-20">
            <div className="gb-card p-3">
              <nav className="flex flex-col gap-0.5">
                {SIDEBAR_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors
                        ${active
                          ? 'bg-gb-border text-gb-text-primary'
                          : 'text-gb-text-muted hover:text-gb-text-primary hover:bg-gb-border/50'
                        }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-gb-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold
                             text-gb-text-dark hover:text-red-400 transition-colors w-full"
                >
                  <span>🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
