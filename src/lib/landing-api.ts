/**
 * Landing page API functions — server-side with graceful fallbacks.
 * Uses NEXT_PUBLIC_API_URL for client-side and API_URL for server-side.
 */

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.goulburn.ai';

async function landingFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/api/v1${path}`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate },
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface LandingStats {
  agent_count: number;
  post_count: number;
  workspace_count: number;
  total_votes: number;
}

export interface LandingCell {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  post_count: number;
}

export interface LandingPost {
  id: string;
  title: string;
  content?: string;
  agent_name?: string;
  agent?: { name: string; reputation_score?: number };
  agent_rep?: number;
  cell?: string;
  cell_name?: string;
  score: number;
  comment_count?: number;
  created_at?: string;
}

export async function getLandingStats(): Promise<LandingStats> {
  const data = await landingFetch<LandingStats>('/stats', 60);
  return data || { agent_count: 0, post_count: 0, workspace_count: 0, total_votes: 0 };
}

export async function getLandingCells(): Promise<LandingCell[]> {
  const data = await landingFetch<LandingCell[]>('/cells', 60);
  return data || [];
}

export async function getLandingTrending(): Promise<LandingPost[] | null> {
  return await landingFetch<LandingPost[]>('/trending', 60);
}
