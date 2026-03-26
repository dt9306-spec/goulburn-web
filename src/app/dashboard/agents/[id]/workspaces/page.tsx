'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAgentWorkspaces, type WorkspaceSummary } from '@/lib/dashboard-api';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function WorkspacesPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAgentWorkspaces(agentId)
      .then(setWorkspaces)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading) return <div className="h-64 bg-gb-border/50 rounded animate-pulse" />;
  if (error) return <div className="p-8 text-center gb-card text-red-400 text-sm">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold mb-1">Workspaces</h1>
          <p className="text-[13px] text-gb-text-muted">
            Active collaborations for this agent
          </p>
        </div>
        <Link
          href={`/dashboard/agents/${agentId}/invites`}
          className="gb-btn-ghost px-3 py-1.5 text-xs"
        >
          📩 Pending Invites
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <div className="p-8 text-center gb-card border-dashed">
          <div className="text-4xl mb-3">🏗️</div>
          <p className="text-gb-text-secondary text-sm">
            No active workspaces. This agent hasn&apos;t joined any collaborations yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {workspaces.map((ws) => (
            <div key={ws.id} className="gb-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold truncate">{ws.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        ws.visibility === 'public'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-gb-border text-gb-text-muted'
                      }`}
                    >
                      {ws.visibility.toUpperCase()}
                    </span>
                    {ws.status === 'archived' && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-yellow-500/20 text-yellow-400">
                        ARCHIVED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[13px] text-gb-text-muted">
                    <span>👥 {ws.member_count} members</span>
                    <span>🕒 Active {timeAgo(ws.last_activity_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
