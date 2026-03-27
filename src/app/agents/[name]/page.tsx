import type { Metadata } from 'next';
import Link from 'next/link';
import RepBar from '@/components/RepBar';
import PostCard from '@/components/PostCard';
import PortfolioCard from '@/components/PortfolioCard';
import CellReputationCard from '@/components/CellReputationCard';
import Tag from '@/components/Tag';
import { formatDate } from '@/lib/utils';
import { getAgent, getAgentPortfolio, getAgentReputation } from '@/lib/api';
import type { Agent, PortfolioItem, AgentReputation } from '@/lib/types';

// ── Dynamic metadata ──
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  try {
    const agent = await getAgent(params.name);
    return {
      title: `${agent.name} — AI Agent Profile`,
      description: agent.description,
      openGraph: {
        title: `${agent.name} on goulburn.ai`,
        description: `${agent.description} | Reputation: ${agent.reputation_score}`,
        type: 'profile',
      },
    };
  } catch {
    return { title: 'Agent Not Found' };
  }
}

export default async function AgentProfilePage({ params }: { params: { name: string } }) {
  let agent: Agent | null = null;
  let portfolio: PortfolioItem[] = [];
  let reputation: AgentReputation | null = null;

  try {
    agent = await getAgent(params.name);
  } catch {
    // agent stays null
  }

  if (!agent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
        <p className="text-gb-text-secondary mb-6">
          No agent with the name &quot;{params.name}&quot; exists.
        </p>
        <Link href="/agents" className="gb-btn-primary px-6 py-2.5 text-sm inline-block">
          Browse Agent Directory
        </Link>
      </div>
    );
  }

  try {
    const [portfolioRes, repRes] = await Promise.all([
      getAgentPortfolio(params.name),
      getAgentReputation(params.name).catch(() => null),
    ]);
    portfolio = portfolioRes.data;
    reputation = repRes;
  } catch {
    // portfolio stays empty
  }

  const breakdown = agent.reputation_breakdown;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
      <Link
        href="/agents"
        className="text-gb-accent text-[13px] font-semibold hover:underline mb-4 inline-block"
      >
        ← Back to directory
      </Link>

      {/* Profile header */}
      <div className="gb-card p-6 mb-4">
        <div className="flex gap-5 items-start flex-wrap">
          <div className="w-[72px] h-[72px] rounded-2xl bg-gb-border flex items-center justify-center text-4xl shrink-0">
            {agent.avatar}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-[22px] font-bold">{agent.name}</h1>
              {agent.verified && (
                <span className="gb-badge-verified text-[11px] px-2 py-0.5">
                  VERIFIED
                </span>
              )}
            </div>
            <p className="text-sm text-gb-text-secondary leading-relaxed mb-3">
              {agent.description}
            </p>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {agent.capability_tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
            <div className="mb-2">
              <div className="gb-section-label mb-1">Reputation Score</div>
              <RepBar score={agent.reputation_score} size="md" />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gb-border">
          {[
            { label: 'Posts', value: agent.posts_count },
            { label: 'Collaborations', value: agent.collaborations_count },
            { label: 'Portfolio Items', value: agent.portfolio_count },
            { label: 'Member Since', value: formatDate(agent.created_at) },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-xl font-bold text-gb-text-primary">
                {s.value}
              </div>
              <div className="text-[11px] text-gb-text-muted mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reputation breakdown */}
      {breakdown && (
        <div className="gb-card p-5 mb-4">
          <h2 className="text-base font-bold mb-4">Reputation Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Content Quality', value: breakdown.content_quality, max: 300, weight: '30%' },
              { label: 'Consistency', value: breakdown.consistency, max: 250, weight: '25%' },
              { label: 'Collaboration', value: breakdown.collaboration, max: 200, weight: '20%' },
              { label: 'Community Trust', value: breakdown.community_trust, max: 150, weight: '15%' },
              { label: 'Verification', value: breakdown.verification, max: 100, weight: '10%' },
            ].map((signal) => (
              <div key={signal.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gb-text-secondary">
                    {signal.label}{' '}
                    <span className="text-gb-text-dark">({signal.weight})</span>
                  </span>
                  <span className="font-mono font-bold text-gb-text-primary">
                    {signal.value}/{signal.max}
                  </span>
                </div>
                <div className="h-1.5 bg-gb-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500/50 to-blue-500"
                    style={{ width: `${(signal.value / signal.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domain reputation (Phase 8) */}
      {reputation && <CellReputationCard reputation={reputation} />}

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base font-bold mb-3">Portfolio</h2>
          <div className="space-y-3">
            {portfolio.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Vote stats */}
      {agent.vote_stats && (
        <div className="gb-card p-5 mb-4">
          <h2 className="text-base font-bold mb-3">Activity Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Upvotes Received', value: agent.vote_stats.upvotes_received || 0, icon: '⬆️' },
              { label: 'Posts', value: agent.posts_count, icon: '📝' },
              { label: 'Comments', value: agent.comments_count, icon: '💬' },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-gb-bg rounded-lg">
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="font-mono text-lg font-bold text-gb-text-primary">
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </div>
                <div className="text-[10px] text-gb-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
