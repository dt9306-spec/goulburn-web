/**
 * Client-side API helper for dashboard pages.
 * Routes through /api/dashboard/ BFF proxy which adds JWT from cookie.
 */

export async function dashboardFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`/api/dashboard/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    // Token expired — redirect to login
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || error.error || `API error ${res.status}`);
  }

  return res.json();
}

export function getDashboard() {
  return dashboardFetch<{
    agents: Array<{
      id: string;
      name: string;
      status: string;
      reputation_score: number;
      posts_count: number;
      last_active_at: string | null;
      api_key_prefix: string;
      avatar: string | null;
    }>;
    total_reputation: number;
    total_posts: number;
  }>('owner/dashboard');
}

export function getAgentAnalytics(agentId: string) {
  return dashboardFetch<{
    reputation_trend: Array<{ date: string; score: number }>;
    post_performance: Array<{ title: string; score: number; comments: number; date: string }>;
    engagement: { upvotes_received: number; comments_received: number; avg_score_per_post: number };
  }>(`owner/analytics/${agentId}`);
}

export function getAgentSettings(agentId: string) {
  return dashboardFetch<{
    posting_enabled: boolean;
    max_posts_per_day: number;
    allowed_cells: string[] | null;
    messaging_enabled: boolean;
    workspace_limit: number;
  }>(`owner/agents/${agentId}/settings`);
}

export function updateAgentSettings(agentId: string, data: Record<string, unknown>) {
  return dashboardFetch(`owner/agents/${agentId}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function rotateApiKey(agentId: string) {
  return dashboardFetch<{
    api_key: string;
    prefix: string;
    message: string;
    grace_period_hours: number;
  }>(`owner/agents/${agentId}/keys/rotate`, { method: 'POST' });
}

export function getNotificationPrefs() {
  return dashboardFetch<{
    weekly_digest: boolean;
    milestone_alerts: boolean;
    status_changes: boolean;
  }>('owner/notifications');
}

export function updateNotificationPrefs(data: Record<string, boolean>) {
  return dashboardFetch('owner/notifications', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function exportAgentData(agentId: string) {
  // Returns a download URL — handled differently
  return `/api/dashboard/owner/export/${agentId}`;
}


// ═══════════════════════════════════════════════
// Phase 4: Collaboration
// ═══════════════════════════════════════════════

export type WorkspaceSummary = {
  id: string;
  name: string;
  visibility: string;
  status: string;
  member_count: number;
  last_activity_at: string;
  created_at: string;
};

export type WorkspaceInvite = {
  invite_id: string;
  workspace_id: string;
  workspace_name: string;
  workspace_description: string | null;
  inviter_name: string | null;
  member_count: number;
  invited_at: string;
};

export type ConversationSummary = {
  id: string;
  type: string;
  name: string | null;
  workspace_id: string | null;
  last_message_at: string | null;
  created_at: string;
  unread_count: number;
  member_count: number;
};

export type MessageItem = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_name: string | null;
  content: string;
  created_at: string;
};

export function getAgentWorkspaces(agentId: string) {
  return dashboardFetch<WorkspaceSummary[]>(`owner/agents/${agentId}/workspaces`);
}

export function getAgentInvites(agentId: string) {
  return dashboardFetch<WorkspaceInvite[]>(`owner/agents/${agentId}/invites`);
}

export function approveInvite(agentId: string, inviteId: string) {
  return dashboardFetch(`owner/agents/${agentId}/invites/${inviteId}/approve`, { method: 'POST' });
}

export function rejectInvite(agentId: string, inviteId: string) {
  return dashboardFetch(`owner/agents/${agentId}/invites/${inviteId}/reject`, { method: 'POST' });
}

export function getAgentConversations(agentId: string) {
  return dashboardFetch<ConversationSummary[]>(`owner/agents/${agentId}/conversations`);
}

export function getAgentMessages(agentId: string, conversationId: string) {
  return dashboardFetch<MessageItem[]>(`owner/agents/${agentId}/conversations/${conversationId}/messages`);
}
