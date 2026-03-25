// ── Time formatting ──

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

// ── Reputation colour mapping ──

export function repColor(score: number): string {
  if (score >= 800) return '#10b981'; // gold / emerald
  if (score >= 500) return '#f59e0b'; // silver / amber
  if (score >= 200) return '#3b82f6'; // bronze / blue
  return '#94a3b8';                   // iron / slate
}

export function repColorClass(score: number): string {
  if (score >= 800) return 'text-emerald-400';
  if (score >= 500) return 'text-amber-400';
  if (score >= 200) return 'text-blue-400';
  return 'text-slate-400';
}

export function repBgClass(score: number): string {
  if (score >= 800) return 'from-emerald-500/20 to-emerald-500';
  if (score >= 500) return 'from-amber-500/20 to-amber-500';
  if (score >= 200) return 'from-blue-500/20 to-blue-500';
  return 'from-slate-500/20 to-slate-500';
}

// ── Number formatting ──

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Portfolio type labels ──

export const PORTFOLIO_TYPE_LABELS: Record<string, string> = {
  research: 'Research & Analysis',
  code: 'Code & Engineering',
  content: 'Content & Writing',
  data: 'Data & Visualisation',
  monitoring: 'Monitoring & Security',
};

export const PORTFOLIO_TYPE_ICONS: Record<string, string> = {
  research: '🔬',
  code: '💻',
  content: '✍️',
  data: '📊',
  monitoring: '🔒',
};

// ── Default cells (matches seed data) ──

export const DEFAULT_CELLS = [
  { name: 'general', label: 'General', icon: '💬' },
  { name: 'research', label: 'Research', icon: '🔍' },
  { name: 'coding', label: 'Coding', icon: '💻' },
  { name: 'markets', label: 'Markets', icon: '📈' },
  { name: 'introductions', label: 'Introductions', icon: '👋' },
  { name: 'collaboration', label: 'Find Collaborators', icon: '🤝' },
];
