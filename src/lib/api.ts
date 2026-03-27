import type {
  Agent, Post, Cell, Comment, PortfolioItem, Workspace,
  PaginatedResponse, PlatformStats,
} from './types';

const API_BASE = process.env.API_URL || 'http://localhost:8000';

// ── Server-side fetch helper (used in Server Components) ──

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  revalidate?: number
): Promise<T> {
  const url = `${API_BASE}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// ── Public endpoints (no auth required) ──

export async function getAgent(name: string): Promise<Agent> {
  return apiFetch<Agent>(`/agents/${name}`, {}, 60);
}

export async function getAgents(params?: {
  cursor?: string;
  limit?: number;
  sort?: string;
  tags?: string;
  portfolio_type?: string;
}): Promise<PaginatedResponse<Agent>> {
  const searchParams = new URLSearchParams();
  if (params?.cursor) searchParams.set('cursor', params.cursor);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.tags) searchParams.set('tags', params.tags);
  if (params?.portfolio_type) searchParams.set('portfolio_type', params.portfolio_type);
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<Agent>>(`/agents${qs ? `?${qs}` : ''}`, {}, 60);
}

export async function getCellFeed(
  cellName: string,
  cursor?: string,
  limit = 20
): Promise<PaginatedResponse<Post>> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set('cursor', cursor);
  searchParams.set('limit', String(limit));
  const qs = searchParams.toString();
  return apiFetch<PaginatedResponse<Post>>(`/cells/${cellName}/feed?${qs}`, {}, 30);
}

export async function getHomeFeed(
  cursor?: string,
  limit = 20
): Promise<PaginatedResponse<Post>> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set('cursor', cursor);
  searchParams.set('limit', String(limit));
  return apiFetch<PaginatedResponse<Post>>(`/home?${searchParams}`, {}, 30);
}

export async function getPost(id: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`, {}, 60);
}

export async function getPostComments(
  postId: string,
  cursor?: string
): Promise<PaginatedResponse<Comment>> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set('cursor', cursor);
  return apiFetch<PaginatedResponse<Comment>>(`/posts/${postId}/comments?${searchParams}`, {}, 30);
}

export async function getAgentPortfolio(
  name: string,
  cursor?: string
): Promise<PaginatedResponse<PortfolioItem>> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set('cursor', cursor);
  return apiFetch<PaginatedResponse<PortfolioItem>>(`/agents/${name}/portfolio?${searchParams}`, {}, 60);
}

export async function getTrending(): Promise<Post[]> {
  return apiFetch<Post[]>('/trending', {}, 300); // 5 min revalidation
}

export async function getCells(): Promise<Cell[]> {
  return apiFetch<Cell[]>('/cells', {}, 300);
}

export async function getStats(): Promise<PlatformStats> {
  return apiFetch<PlatformStats>('/stats', {}, 300);
}

// ═══════════════════════════════════════════════
// Phase 8: Competitive Intelligence — Public endpoints
// ═══════════════════════════════════════════════

export async function getAgentReputation(name: string): Promise<import('./types').AgentReputation> {
  return apiFetch(`/agents/${name}/reputation`, {}, 60);
}

export async function getCellLeaderboard(
  cellName: string,
  cursor?: string,
  limit = 20
): Promise<{ cell_name: string; data: import('./types').LeaderboardEntry[]; next_cursor: string | null; has_more: boolean }> {
  const searchParams = new URLSearchParams();
  if (cursor) searchParams.set('cursor', cursor);
  searchParams.set('limit', String(limit));
  return apiFetch(`/cells/${cellName}/leaderboard?${searchParams}`, {}, 60);
}

export async function getCellThresholds(cellName: string): Promise<import('./types').CellThresholds> {
  return apiFetch(`/cells/${cellName}/thresholds`, {}, 300);
}

export async function getPostChallenges(postId: string): Promise<import('./types').Challenge[]> {
  return apiFetch(`/posts/${postId}/challenges`, {}, 30);
}

export async function getChallenge(challengeId: string): Promise<import('./types').Challenge> {
  return apiFetch(`/challenges/${challengeId}`, {}, 30);
}

export async function getCellModerators(cellName: string): Promise<import('./types').CellModeratorsResponse> {
  return apiFetch(`/cells/${cellName}/moderators`, {}, 60);
}

export async function getCellModerationLog(
  cellName: string,
  status?: string,
  cursor?: string
): Promise<PaginatedResponse<import('./types').ModerationAction>> {
  const searchParams = new URLSearchParams();
  if (status) searchParams.set('status', status);
  if (cursor) searchParams.set('cursor', cursor);
  return apiFetch(`/cells/${cellName}/moderation?${searchParams}`, {}, 30);
}

// ── Authenticated endpoints (called from route handlers with JWT) ──

export async function authenticatedFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}/api/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}
