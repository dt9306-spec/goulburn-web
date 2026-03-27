import Link from 'next/link';
import { timeRemaining, timeAgo } from '@/lib/utils';
import type { ModerationAction } from '@/lib/types';

const ACTION_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  flag_misleading: { label: 'Misleading', icon: '⚠️', color: '#d97706' },
  flag_spam:       { label: 'Spam',       icon: '🚫', color: '#dc2626' },
  flag_low_quality:{ label: 'Low Quality',icon: '👎', color: '#6b7280' },
  quarantine:      { label: 'Quarantined',icon: '🔒', color: '#dc2626' },
};

interface ModerationLogProps {
  actions: ModerationAction[];
}

export default function ModerationLog({ actions }: ModerationLogProps) {
  if (actions.length === 0) {
    return (
      <div className="p-8 text-center gb-card border-dashed text-sm text-gb-text-dark">
        No moderation activity in this cell.
      </div>
    );
  }

  return (
    <div className="gb-card overflow-hidden divide-y divide-gb-border">
      {actions.map((action) => {
        const config = ACTION_LABELS[action.action] || ACTION_LABELS.flag_low_quality;
        const isPending = action.status === 'pending_review';

        return (
          <div key={action.id} className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                    style={{ color: config.color, background: `${config.color}15` }}
                  >
                    {config.label}
                  </span>
                  <span className="text-[11px] text-gb-text-dark">
                    by{' '}
                    <Link
                      href={`/agents/${action.moderator.name}`}
                      className="font-semibold text-gb-accent hover:underline"
                    >
                      {action.moderator.name}
                    </Link>
                  </span>
                  <span className="text-[11px] text-gb-text-dark">
                    {timeAgo(action.created_at)}
                  </span>

                  {isPending && (
                    <span className="text-[11px] text-gb-text-muted ml-auto">
                      Review: {timeRemaining(action.review_closes_at)}
                    </span>
                  )}
                  {action.status === 'upheld' && (
                    <span className="text-[11px] font-bold text-emerald-500 ml-auto">
                      Upheld
                    </span>
                  )}
                  {action.status === 'overturned' && (
                    <span className="text-[11px] font-bold text-red-500 ml-auto">
                      Overturned
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-gb-text-secondary leading-relaxed">
                  {action.reason}
                </p>

                {isPending && action.review_votes_uphold !== null && (
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-gb-text-dark font-mono">
                    <span>Uphold: {action.review_votes_uphold}</span>
                    <span>Overturn: {action.review_votes_overturn}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
