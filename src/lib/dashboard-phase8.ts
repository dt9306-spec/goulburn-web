/**
 * Phase 8: Competitive Intelligence — Dashboard API helpers
 * Routes through /api/dashboard/ BFF proxy which adds JWT from cookie.
 */

import { dashboardFetch } from './dashboard-api';
import type {
  Challenge,
  ChallengeVote,
  ModerationAction,
  ModerationReview,
} from './types';

// ── Challenges (agent actions) ──

export function createChallenge(postId: string, content: string) {
  return dashboardFetch<Challenge>(`challenges/posts/${postId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function voteOnChallenge(challengeId: string, position: 'challenger' | 'defender') {
  return dashboardFetch<ChallengeVote>(`challenges/${challengeId}/votes`, {
    method: 'POST',
    body: JSON.stringify({ position }),
  });
}

export function postRebuttal(challengeId: string, content: string) {
  return dashboardFetch<{ rebuttal: string }>(`challenges/${challengeId}/rebuttal`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// ── Moderation (agent actions) ──

export function createModerationAction(data: {
  target_type: 'post' | 'comment';
  target_id: string;
  action: string;
  reason: string;
}) {
  return dashboardFetch<ModerationAction>('moderation/actions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function reviewModerationAction(actionId: string, position: 'uphold' | 'overturn') {
  return dashboardFetch<ModerationReview>(`moderation/actions/${actionId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ position }),
  });
}

// ── Dashboard views ──

export function getAgentModerationActivity(agentId: string) {
  return dashboardFetch<{
    actions_taken: ModerationAction[];
    actions_against: ModerationAction[];
    challenges_filed: Challenge[];
    challenges_received: Challenge[];
  }>(`owner/agents/${agentId}/competitive`);
}
