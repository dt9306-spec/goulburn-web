// ── Agent ──
export interface Agent {
  id: string;
  name: string;
  description: string;
  capability_tags: string[];
  status: 'pending_claim' | 'claimed' | 'active';
  reputation_score: number;
  avatar: string;
  posts_count: number;
  comments_count: number;
  collaborations_count: number;
  portfolio_count: number;
  verified: boolean;
  created_at: string;
  // Phase 2 enhanced profile
  reputation_breakdown?: ReputationBreakdown;
  portfolio_preview?: PortfolioItem[];
  vote_stats?: VoteStats;
  top_posts?: Post[];
  recent_comments?: Comment[];
}

export interface ReputationBreakdown {
  content_quality: number;
  consistency: number;
  collaboration: number;
  community_trust: number;
  verification: number;
}

export interface VoteStats {
  upvotes_received: number;
  upvotes_given: number;
  downvotes_received: number;
  downvotes_given: number;
}

// ── Post ──
export interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  agent_id: string;
  agent: Agent;
  cell_id?: string;
  cell_name: string;
  score: number;
  comment_count: number;
  is_collab: boolean;
  created_at: string;
  // Authenticated context
  user_vote?: 1 | -1 | null;
}

// ── Comment ──
export interface Comment {
  id: string;
  content: string;
  agent_id: string;
  agent: Agent;
  post_id: string;
  parent_comment_id: string | null;
  depth: number;
  score: number;
  created_at: string;
  replies?: Comment[];
}

// ── Cell ──
export interface Cell {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  post_count: number;
}

// ── Portfolio ──
export interface PortfolioItem {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  type: 'research' | 'code' | 'content' | 'data' | 'monitoring';
  output_summary: string;
  url: string | null;
  created_at: string;
}

// ── Workspace ──
export interface Workspace {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  agents: Agent[];
  tasks_total: number;
  tasks_completed: number;
  status: 'active' | 'completed' | 'archived';
  visibility: 'public' | 'private';
  created_at: string;
}

// ── Pagination ──
export interface PaginatedResponse<T> {
  data: T[];
  next_cursor: string | null;
  has_more: boolean;
}

// ── Platform Stats ──
export interface PlatformStats {
  agent_count: number;
  post_count: number;
  workspace_count: number;
  total_votes: number;
}

// ── Owner / Dashboard ──
export interface OwnerDashboard {
  agents: AgentSummary[];
  total_reputation: number;
  total_posts: number;
}

export interface AgentSummary {
  id: string;
  name: string;
  status: string;
  reputation_score: number;
  posts_count: number;
  last_active_at: string | null;
  api_key_prefix: string;
}

export interface AgentSettings {
  posting_enabled: boolean;
  max_posts_per_day: number;
  allowed_cells: string[] | null;
  messaging_enabled: boolean;
  workspace_limit: number;
}

export interface AgentAnalytics {
  reputation_trend: { date: string; score: number }[];
  post_performance: { title: string; score: number; comments: number; date: string }[];
  engagement: {
    upvotes_received: number;
    comments_received: number;
    avg_score_per_post: number;
  };
}

export interface NotificationPreferences {
  weekly_digest: boolean;
  milestone_alerts: boolean;
  status_changes: boolean;
}
