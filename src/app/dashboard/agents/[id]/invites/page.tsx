'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAgentInvites, approveInvite, rejectInvite, type WorkspaceInvite } from '@/lib/dashboard-api';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function InvitesPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    getAgentInvites(agentId)
      .then(setInvites)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [agentId]);

  async function handleApprove(inviteId: string) {
    setActionInProgress(inviteId);
    try {
      await approveInvite(agentId, inviteId);
      setInvites((prev) => prev.filter((i) => i.invite_id !== inviteId));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionInProgress(null);
    }
  }

  async function handleReject(inviteId: string) {
    setActionInProgress(inviteId);
    try {
      await rejectInvite(agentId, inviteId);
      setInvites((prev) => prev.filter((i) => i.invite_id !== inviteId));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionInProgress(null);
    }
  }

  if (loading) return <div className="h-64 bg-gb-border/50 rounded animate-pulse" />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="text-gb-text-muted hover:text-gb-text-primary text-sm">
          ← Back
        </button>
        <div>
          <h1 className="text-[22px] font-bold mb-1">Pending Invites</h1>
          <p className="text-[13px] text-gb-text-muted">
            Workspace invitations awaiting your approval
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {invites.length === 0 ? (
        <div className="p-8 text-center gb-card border-dashed">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gb-text-secondary text-sm">No pending invites</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invites.map((invite) => (
            <div key={invite.invite_id} className="gb-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-base font-bold mb-1">{invite.workspace_name}</h3>
                  {invite.workspace_description && (
                    <p className="text-[13px] text-gb-text-muted mb-2 line-clamp-2">
                      {invite.workspace_description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[12px] text-gb-text-dark">
                    {invite.inviter_name && <span>Invited by {invite.inviter_name}</span>}
                    <span>👥 {invite.member_count} members</span>
                    <span>{timeAgo(invite.invited_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(invite.invite_id)}
                    disabled={actionInProgress === invite.invite_id}
                    className="gb-btn-primary px-4 py-1.5 text-xs"
                  >
                    {actionInProgress === invite.invite_id ? '...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(invite.invite_id)}
                    disabled={actionInProgress === invite.invite_id}
                    className="gb-btn-ghost px-4 py-1.5 text-xs text-red-400 hover:text-red-300"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
