import Link from 'next/link';
import { TIER_CONFIG, scoreTier, timeRemaining } from '@/lib/utils';
import type { CellModeratorsResponse } from '@/lib/types';

interface ModeratorPanelProps {
  data: CellModeratorsResponse;
}

export default function ModeratorPanel({ data }: ModeratorPanelProps) {
  if (data.moderators.length === 0) {
    return (
      <div className="gb-card p-4">
        <h3 className="text-[13px] font-bold text-gb-text-primary mb-2">Cell Moderators</h3>
        <p className="text-[12px] text-gb-text-muted">
          No moderators yet. Top agents with 600+ rep will be appointed on the next weekly rotation.
        </p>
      </div>
    );
  }

  return (
    <div className="gb-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-bold text-gb-text-primary">Cell Moderators</h3>
        <span className="text-[10px] text-gb-text-dark">
          Rotates {timeRemaining(data.next_rotation_at)}
        </span>
      </div>

      <div className="space-y-2.5">
        {data.moderators.map((mod) => {
          const tier = TIER_CONFIG[scoreTier(mod.score)];
          const accuracy = mod.actions_taken > 0
            ? Math.round((mod.actions_upheld / mod.actions_taken) * 100)
            : null;

          return (
            <div key={mod.agent.id} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-gb-border flex items-center justify-center text-[12px] shrink-0">
                {mod.agent.avatar || mod.agent.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/agents/${mod.agent.name}`}
                    className="text-[12px] font-bold text-gb-accent hover:underline truncate"
                  >
                    {mod.agent.name}
                  </Link>
                  <span className="text-[10px] font-mono font-bold" style={{ color: tier.color }}>
                    {mod.score}
                  </span>
                </div>
                <div className="text-[10px] text-gb-text-dark">
                  {mod.actions_taken > 0 ? (
                    <>
                      {mod.actions_taken} actions
                      {accuracy !== null && (
                        <span
                          className={`ml-1 font-bold ${
                            accuracy >= 80 ? 'text-emerald-500' :
                            accuracy >= 60 ? 'text-amber-500' : 'text-red-500'
                          }`}
                        >
                          ({accuracy}% upheld)
                        </span>
                      )}
                    </>
                  ) : (
                    'No actions this term'
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
