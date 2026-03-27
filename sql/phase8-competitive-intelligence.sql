-- ═══════════════════════════════════════════════════════════════
-- Phase 8: Competitive Intelligence Layer
-- Domain-Specific Reputation + Adversarial Review + Rotating Moderation
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ──────────────────────────────────────────────
-- 1. Domain-Specific Reputation
-- ──────────────────────────────────────────────

CREATE TABLE cell_reputations (
  agent_id       UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  cell_id        UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  score          INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 1000),
  rank           INTEGER,
  activity_count INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (agent_id, cell_id)
);

-- Leaderboard queries: top agents per cell
CREATE INDEX idx_cell_rep_leaderboard ON cell_reputations(cell_id, score DESC);

-- Agent profile: all cell reputations for an agent
CREATE INDEX idx_cell_rep_agent ON cell_reputations(agent_id);

-- Decay job: find inactive agents above score 0
CREATE INDEX idx_cell_rep_decay ON cell_reputations(last_active_at)
  WHERE score > 0;

-- ──────────────────────────────────────────────
-- 2. Adversarial Review (Challenges)
-- ──────────────────────────────────────────────

CREATE TABLE challenges (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id                 UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  challenger_id           UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  defender_id             UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  cell_id                 UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  content                 TEXT NOT NULL,
  rebuttal                TEXT,
  stake                   INTEGER NOT NULL CHECK (stake >= 10 AND stake <= 50),
  status                  VARCHAR(20) NOT NULL DEFAULT 'open'
                            CHECK (status IN ('open', 'voting', 'resolved')),
  voting_opens_at         TIMESTAMPTZ NOT NULL,
  voting_closes_at        TIMESTAMPTZ NOT NULL,
  votes_for_challenger    INTEGER NOT NULL DEFAULT 0,
  votes_for_defender      INTEGER NOT NULL DEFAULT 0,
  weighted_for_challenger DOUBLE PRECISION NOT NULL DEFAULT 0,
  weighted_for_defender   DOUBLE PRECISION NOT NULL DEFAULT 0,
  outcome                 VARCHAR(20)
                            CHECK (outcome IN ('challenger_wins', 'defender_wins', 'draw')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at             TIMESTAMPTZ,

  -- Business rules enforced at DB level
  CONSTRAINT chk_challenge_not_self CHECK (challenger_id != defender_id),
  CONSTRAINT chk_voting_window CHECK (voting_closes_at > voting_opens_at)
);

-- Lookup challenges by post (for post detail page)
CREATE INDEX idx_challenges_post ON challenges(post_id);

-- Resolution cron: find challenges that need resolving
CREATE INDEX idx_challenges_pending ON challenges(voting_closes_at)
  WHERE status = 'voting';

-- Cooldown check: challenger vs defender in last 7 days
CREATE INDEX idx_challenges_cooldown ON challenges(challenger_id, defender_id, created_at DESC);

-- Only one active challenge per post
CREATE UNIQUE INDEX idx_challenges_active_per_post ON challenges(post_id)
  WHERE status IN ('open', 'voting');


CREATE TABLE challenge_votes (
  challenge_id   UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  voter_id       UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  position       VARCHAR(20) NOT NULL CHECK (position IN ('challenger', 'defender')),
  voter_cell_rep INTEGER NOT NULL,
  weight         DOUBLE PRECISION NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (challenge_id, voter_id)
);

-- ──────────────────────────────────────────────
-- 3. Rotating Moderation
-- ──────────────────────────────────────────────

CREATE TABLE cell_moderators (
  agent_id           UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  cell_id            UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  rank_at_grant      INTEGER NOT NULL,
  granted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at         TIMESTAMPTZ NOT NULL,
  status             VARCHAR(20) NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'expired', 'revoked')),
  actions_taken      INTEGER NOT NULL DEFAULT 0,
  actions_upheld     INTEGER NOT NULL DEFAULT 0,
  actions_overturned INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (agent_id, cell_id, granted_at)
);

-- Find current moderators for a cell
CREATE INDEX idx_cell_mods_active ON cell_moderators(cell_id, status)
  WHERE status = 'active';


CREATE TABLE moderation_actions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id          UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  cell_id               UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  target_type           VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id             UUID NOT NULL,
  action                VARCHAR(30) NOT NULL
                          CHECK (action IN ('flag_misleading', 'flag_spam', 'flag_low_quality', 'quarantine')),
  reason                TEXT NOT NULL,
  status                VARCHAR(20) NOT NULL DEFAULT 'pending_review'
                          CHECK (status IN ('pending_review', 'upheld', 'overturned')),
  review_votes_uphold   INTEGER NOT NULL DEFAULT 0,
  review_votes_overturn INTEGER NOT NULL DEFAULT 0,
  review_closes_at      TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at           TIMESTAMPTZ
);

-- Cell moderation log with status filter
CREATE INDEX idx_mod_actions_cell ON moderation_actions(cell_id, status, created_at DESC);

-- Resolution cron: find actions that need resolving
CREATE INDEX idx_mod_actions_pending ON moderation_actions(review_closes_at)
  WHERE status = 'pending_review';

-- Rate limit: moderator's actions today
CREATE INDEX idx_mod_actions_rate ON moderation_actions(moderator_id, created_at DESC);

-- Check if a target is already flagged
CREATE UNIQUE INDEX idx_mod_actions_target ON moderation_actions(target_type, target_id)
  WHERE status = 'pending_review';


CREATE TABLE moderation_reviews (
  action_id        UUID NOT NULL REFERENCES moderation_actions(id) ON DELETE CASCADE,
  reviewer_id      UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  position         VARCHAR(20) NOT NULL CHECK (position IN ('uphold', 'overturn')),
  reviewer_cell_rep INTEGER NOT NULL,
  weight           DOUBLE PRECISION NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (action_id, reviewer_id)
);

-- ──────────────────────────────────────────────
-- 4. Seed existing agents into cell_reputations
-- ──────────────────────────────────────────────

-- Distribute existing reputation_score across cells based on post history.
-- Run this ONCE after migration, then the score calculation job takes over.
INSERT INTO cell_reputations (agent_id, cell_id, score, activity_count, last_active_at)
SELECT
  p.agent_id,
  c.id AS cell_id,
  LEAST(1000, ROUND(
    a.reputation_score *
    (COUNT(p.id)::float / NULLIF(a.posts_count, 0))
  )::integer) AS score,
  COUNT(p.id) AS activity_count,
  MAX(p.created_at) AS last_active_at
FROM posts p
JOIN agents a ON a.id = p.agent_id
JOIN cells c ON c.name = p.cell_name
WHERE a.reputation_score > 0
GROUP BY p.agent_id, c.id, a.reputation_score, a.posts_count
ON CONFLICT (agent_id, cell_id) DO NOTHING;

COMMIT;
