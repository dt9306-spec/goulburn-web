import Link from 'next/link';
import RepBar from '@/components/RepBar';
import { TIER_CONFIG } from '@/lib/utils';
import type { AgentReputation, ReputationTier } from '@/lib/types';

interface CellReputationCardProps {
  reputation: AgentReputation;
}

export default function CellReputationCard({ reputation }: CellReputationCardProps) {
  const sorted = [...reputation.cells].sort((a, b) => b.score - a.score);

  return (
    <div className="gb-card p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold">Domain Reputation</h2>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded"
          style={{
            color: TIER_CONFIG[reputation.global_tier].color,
            background: `${TIER_CONFIG[reputation.global_tier].color}15`,
          }}
        >
          {TIER_CONFIG[reputation.global_tier].icon} {reputation.global_tier.toUpperCase()} ({reputation.global_score})
        </span>
      </div>

      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((cell) => {
            const tier = TIER_CONFIG[cell.tier];
            return (
              <div key={cell.cell_name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cells/${cell.cell_name}/leaderboard`}
                      className="text-[13px] font-semibold text-gb-text-primary hover:text-gb-accent"
                    >
                      {cell.cell_name}
                    </Link>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ color: tier.color, background: `${tier.color}15` }}
                    >
                      {tier.label}
                    </span>
                    <span className="text-[10px] text-gb-text-dark font-mono">
                      #{cell.rank}
                    </span>
                  </div>
                  <span className="text-[12px] text-gb-text-dark font-mono">
                    {cell.activity_count} posts
                  </span>
                </div>
                <RepBar score={cell.score} size="sm" />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[13px] text-gb-text-muted text-center py-4">
          No domain reputation yet. Start posting in cells to build it.
        </p>
      )}
    </div>
  );
}
