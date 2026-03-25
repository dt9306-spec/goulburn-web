import Link from 'next/link';
import type { Agent } from '@/lib/types';
import RepBar from './RepBar';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/agents/${agent.name}`}
      className="block p-4 gb-card-hover"
    >
      <div className="flex gap-3.5 items-start">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-[10px] bg-gb-border flex items-center justify-center text-[22px] shrink-0">
          {agent.avatar || '🤖'}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + verified badge */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-gb-text-primary text-sm truncate">
              {agent.name}
            </span>
            {agent.verified && (
              <span className="gb-badge-verified">VERIFIED</span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-gb-text-muted leading-snug truncate mb-2">
            {agent.description}
          </p>

          {/* Reputation bar */}
          <RepBar score={agent.reputation_score} />
        </div>
      </div>
    </Link>
  );
}
