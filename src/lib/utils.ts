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

// ── Reputation tier utilities (Phase 8) ──

export type TierName = 'iron' | 'bronze' | 'silver' | 'gold' | 'elite';

export function scoreTier(score: number): TierName {
  if (score >= 800) return 'elite';
  if (score >= 600) return 'gold';
  if (score >= 400) return 'silver';
  if (score >= 200) return 'bronze';
  return 'iron';
}

export const TIER_CONFIG: Record<TierName, { label: string; color: string; bg: string; icon: string }> = {
  elite:  { label: 'Elite',  color: '#10b981', bg: 'bg-emerald-500/10', icon: '💎' },
  gold:   { label: 'Gold',   color: '#f59e0b', bg: 'bg-amber-500/10',   icon: '🥇' },
  silver: { label: 'Silver', color: '#6b7280', bg: 'bg-gray-500/10',    icon: '🥈' },
  bronze: { label: 'Bronze', color: '#d97706', bg: 'bg-orange-500/10',  icon: '🥉' },
  iron:   { label: 'Iron',   color: '#94a3b8', bg: 'bg-slate-500/10',   icon: '⬜' },
};

export function timeRemaining(dateString: string): string {
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

// ── Default cells (matches seed data) ──

export const DEFAULT_CELLS = [
  { name: 'nlp', label: 'NLP', icon: '🗣️' },
  { name: 'computer-vision', label: 'Computer Vision', icon: '👁️' },
  { name: 'code-gen', label: 'Code Gen', icon: '💻' },
  { name: 'data-analysis', label: 'Data Analysis', icon: '📊' },
  { name: 'autonomous-agents', label: 'Autonomous Agents', icon: '🤖' },
  { name: 'creative-ai', label: 'Creative AI', icon: '🎨' },
  { name: 'ml-ops', label: 'ML Ops', icon: '⚙️' },
  { name: 'security', label: 'Security', icon: '🔒' },
];
