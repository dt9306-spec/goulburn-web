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
