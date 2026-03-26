/**
 * Phase 6: Dashboard API helpers for moderation, disputes, admin.
 * Routes through /api/dashboard/ BFF proxy.
 */

import { dashboardFetch } from './dashboard-api';

// ── Types ──

export type QueueItem = {
  id: string;
  target_type: string;
  target_id: string;
  source: string;
  severity: string;
  report_count: number;
  assigned_to: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type QueueItemDetail = QueueItem & {
  reports: Array<{
    id: string;
    reporter_id: string | null;
    reason: string;
    description: string | null;
    evidence: Record<string, unknown>;
    status: string;
    created_at: string;
  }>;
  agent_flags: Array<{
    id: string;
    flag_type: string;
    severity_score: number;
    evidence: Record<string, unknown>;
    created_at: string;
  }>;
  dispute_events: Array<{
    id: string;
    event_type: string;
    actor_id: string | null;
    actor_type: string | null;
    content: string | null;
    credit_amount: number | null;
    created_at: string;
  }>;
};

export type AdminStats = {
  reports_today: number;
  reports_7d: number;
  reports_30d: number;
  open_disputes: number;
  agents_warned: number;
  agents_suspended: number;
  agents_banned: number;
  queue_depth_pending: number;
  queue_depth_in_review: number;
};

export type EconomyHealth = {
  latest: {
    metrics: Record<string, number>;
    alerts: Array<{ type: string; metric: string; value: number; threshold: number }>;
    created_at: string;
  } | null;
  trend: Array<{ metrics: Record<string, number>; created_at: string }>;
  active_alerts: Array<{ type: string; metric: string; value: number; threshold: number }>;
};

export type ReputationHealth = EconomyHealth;

export type CircuitBreakerState = {
  state: string;
  error_rate: number;
  total_requests_5m: number;
  error_count_5m: number;
};

export type ReportItem = {
  id: string;
  reporter_id: string | null;
  target_type: string;
  target_id: string;
  reason: string;
  description: string | null;
  evidence: Record<string, unknown>;
  status: string;
  created_at: string;
};

// ── Admin Queue ──

export function getAdminQueue(params?: { status?: string; severity?: string; source?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status_filter', params.status);
  if (params?.severity) qs.set('severity', params.severity);
  if (params?.source) qs.set('source', params.source);
  const query = qs.toString();
  return dashboardFetch<{ data: QueueItem[]; count: number }>(`admin/queue${query ? '?' + query : ''}`);
}

export function getQueueItemDetail(id: string) {
  return dashboardFetch<QueueItemDetail>(`admin/queue/${id}`);
}

export function assignQueueItem(id: string) {
  return dashboardFetch(`admin/queue/${id}/assign`, { method: 'POST' });
}

export function takeAction(id: string, data: { action_type: string; reason: string; suspension_days?: number }) {
  return dashboardFetch(`admin/queue/${id}/action`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Disputes ──

export function resolveDispute(gigId: string, data: { outcome: string; reason: string }) {
  return dashboardFetch(`admin/disputes/${gigId}/resolve`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Admin Stats & Health ──

export function getAdminStats() {
  return dashboardFetch<AdminStats>('admin/stats');
}

export function getEconomyHealth() {
  return dashboardFetch<EconomyHealth>('admin/economy-health');
}

export function getReputationHealth() {
  return dashboardFetch<ReputationHealth>('admin/reputation-health');
}

export function getCircuitBreakerStatus() {
  return dashboardFetch<CircuitBreakerState>('admin/circuit-breaker/status');
}

export function resetCircuitBreaker() {
  return dashboardFetch('admin/circuit-breaker/reset', { method: 'POST' });
}

// ── Agent History ──

export function getAgentModerationHistory(agentId: string) {
  return dashboardFetch<{
    agent_id: string;
    agent_name: string;
    moderation_status: string;
    moderation_trust_score: number;
    reports: Array<{ id: string; reason: string; status: string; created_at: string }>;
    actions: Array<{ id: string; action_type: string; reason: string; created_at: string }>;
    flags: Array<{ id: string; flag_type: string; severity_score: number; status: string; created_at: string }>;
  }>(`admin/agents/${agentId}/history`);
}

export function unsuspendAgent(agentId: string) {
  return dashboardFetch(`admin/agents/${agentId}/unsuspend`, { method: 'POST' });
}

// ── Owner Moderation View (non-admin) ──

export function getMyReports() {
  return dashboardFetch<{ data: ReportItem[]; count: number }>('owner/reports');
}
