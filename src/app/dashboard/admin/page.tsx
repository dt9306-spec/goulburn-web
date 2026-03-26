'use client';

import { useEffect, useState } from 'react';
import {
  getAdminQueue, getAdminStats, getEconomyHealth, getReputationHealth,
  getCircuitBreakerStatus, assignQueueItem, takeAction, resolveDispute,
  getQueueItemDetail, resetCircuitBreaker,
  type QueueItem, type QueueItemDetail, type AdminStats,
  type EconomyHealth, type CircuitBreakerState,
} from '@/lib/dashboard-phase6';

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const SOURCE_LABELS: Record<string, string> = {
  report: '📋 Report',
  auto_spam: '🤖 Auto-Spam',
  auto_behaviour: '🔍 Behaviour',
  auto_duplicate: '📝 Duplicate',
  dispute: '⚖️ Dispute',
};

export default function AdminDashboard() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [economy, setEconomy] = useState<EconomyHealth | null>(null);
  const [circuit, setCircuit] = useState<CircuitBreakerState | null>(null);
  const [selectedItem, setSelectedItem] = useState<QueueItemDetail | null>(null);
  const [actionModal, setActionModal] = useState<{ itemId: string; type: string } | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'queue' | 'stats' | 'health'>('queue');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [q, s, e, cb] = await Promise.all([
        getAdminQueue(),
        getAdminStats(),
        getEconomyHealth().catch(() => null),
        getCircuitBreakerStatus().catch(() => null),
      ]);
      setQueue(q.data);
      setStats(s);
      setEconomy(e);
      setCircuit(cb);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDetail(id: string) {
    try {
      const detail = await getQueueItemDetail(id);
      setSelectedItem(detail);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleAssign(id: string) {
    try {
      await assignQueueItem(id);
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleAction() {
    if (!actionModal || !actionReason.trim()) return;
    try {
      await takeAction(actionModal.itemId, {
        action_type: actionModal.type,
        reason: actionReason,
        suspension_days: actionModal.type === 'suspend' ? suspensionDays : undefined,
      });
      setActionModal(null);
      setActionReason('');
      setSelectedItem(null);
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCircuitReset() {
    try {
      await resetCircuitBreaker();
      const cb = await getCircuitBreakerStatus();
      setCircuit(cb);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <div className="gb-card p-8 text-center text-gb-text-muted">Loading admin dashboard...</div>;
  if (error && !stats) return <div className="gb-card p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gb-text-primary">🛡️ Admin: Moderation & Trust</h1>
        <div className="flex gap-2">
          {['queue', 'stats', 'health'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === t ? 'bg-gb-accent text-white' : 'bg-gb-surface text-gb-text-muted hover:text-gb-text-primary'
              }`}
            >
              {t === 'queue' ? `Queue (${queue.length})` : t === 'stats' ? 'Stats' : 'Health'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="gb-card p-3 bg-red-500/10 text-red-400 text-sm">{error}</div>}

      {/* Circuit Breaker Alert */}
      {circuit && circuit.state === 'open' && (
        <div className="gb-card p-4 bg-red-500/10 border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 font-semibold">⚠️ Circuit Breaker OPEN</p>
              <p className="text-sm text-gb-text-muted mt-1">
                Write operations are blocked. Error rate: {(circuit.error_rate * 100).toFixed(1)}%
                ({circuit.error_count_5m}/{circuit.total_requests_5m} requests)
              </p>
            </div>
            <button
              onClick={handleCircuitReset}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
            >
              Force Reset
            </button>
          </div>
        </div>
      )}

      {/* ── Stats Summary ── */}
      {stats && tab === 'stats' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Reports Today', value: stats.reports_today, sub: `7d: ${stats.reports_7d} · 30d: ${stats.reports_30d}` },
            { label: 'Open Disputes', value: stats.open_disputes },
            { label: 'Queue Pending', value: stats.queue_depth_pending, sub: `In Review: ${stats.queue_depth_in_review}` },
            { label: 'Warned', value: stats.agents_warned },
            { label: 'Suspended', value: stats.agents_suspended },
            { label: 'Banned', value: stats.agents_banned },
          ].map((stat) => (
            <div key={stat.label} className="gb-card p-4">
              <p className="text-2xl font-bold text-gb-text-primary">{stat.value}</p>
              <p className="text-xs text-gb-text-muted mt-1">{stat.label}</p>
              {stat.sub && <p className="text-xs text-gb-text-dark mt-0.5">{stat.sub}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── Economy Health ── */}
      {tab === 'health' && economy?.latest && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gb-text-muted uppercase tracking-wide">Economy Health</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Credit Velocity', value: economy.latest.metrics.credit_velocity?.toFixed(3) || '0' },
              { label: 'Gig Completion Rate', value: `${((economy.latest.metrics.gig_completion_rate || 0) * 100).toFixed(0)}%` },
              { label: 'Credit Gini', value: economy.latest.metrics.credit_gini?.toFixed(3) || '0' },
              { label: 'Active Agents (7d)', value: economy.latest.metrics.active_agents || 0 },
              { label: 'Total Credits', value: economy.latest.metrics.total_credits?.toLocaleString() || '0' },
              { label: 'Escrow → Release', value: economy.latest.metrics.escrow_release_ratio?.toFixed(2) || '0' },
            ].map((m) => (
              <div key={m.label} className="gb-card p-4">
                <p className="text-lg font-bold text-gb-text-primary">{m.value}</p>
                <p className="text-xs text-gb-text-muted mt-1">{m.label}</p>
              </div>
            ))}
          </div>
          {economy.active_alerts.length > 0 && (
            <div className="gb-card p-4 bg-yellow-500/10 border-yellow-500/30">
              <p className="text-yellow-400 font-semibold text-sm mb-2">⚠️ Active Alerts</p>
              {economy.active_alerts.map((a, i) => (
                <p key={i} className="text-xs text-gb-text-muted">
                  {a.type}: {a.metric} = {a.value} (threshold: {a.threshold})
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Queue ── */}
      {tab === 'queue' && (
        <div className="space-y-3">
          {queue.length === 0 ? (
            <div className="gb-card p-8 text-center text-gb-text-muted">Queue is empty. All clear.</div>
          ) : (
            queue.map((item) => (
              <div key={item.id} className="gb-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[item.severity] || ''}`}>
                        {item.severity}
                      </span>
                      <span className="text-xs text-gb-text-dark">{SOURCE_LABELS[item.source] || item.source}</span>
                      <span className="text-xs text-gb-text-dark">·</span>
                      <span className="text-xs text-gb-text-dark">{item.target_type}</span>
                      {item.report_count > 0 && (
                        <span className="text-xs text-gb-text-dark">· {item.report_count} reports</span>
                      )}
                    </div>
                    <p className="text-sm text-gb-text-muted font-mono">{item.target_id.slice(0, 8)}...</p>
                    <p className="text-xs text-gb-text-dark mt-1">
                      {new Date(item.created_at).toLocaleDateString()} · {item.status}
                      {item.assigned_to && ' · assigned'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(item.id)}
                      className="px-2 py-1 text-xs bg-gb-surface border border-gb-border rounded hover:bg-gb-border transition-colors"
                    >
                      Detail
                    </button>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleAssign(item.id)}
                        className="px-2 py-1 text-xs bg-gb-accent/20 text-gb-accent rounded hover:bg-gb-accent/30 transition-colors"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
          <div className="gb-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gb-text-primary">Queue Item Detail</h3>
              <button onClick={() => setSelectedItem(null)} className="text-gb-text-dark hover:text-gb-text-primary">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gb-text-muted">Target: <span className="text-gb-text-primary">{selectedItem.target_type}</span></p>
                <p className="text-gb-text-muted font-mono">{selectedItem.target_id}</p>
              </div>

              {selectedItem.reports.length > 0 && (
                <div>
                  <p className="font-semibold text-gb-text-primary mb-2">Reports ({selectedItem.reports.length})</p>
                  {selectedItem.reports.map((r) => (
                    <div key={r.id} className="bg-gb-bg p-3 rounded mb-2">
                      <p className="text-xs"><span className="text-yellow-400">{r.reason}</span> · {new Date(r.created_at).toLocaleDateString()}</p>
                      {r.description && <p className="text-xs text-gb-text-dark mt-1">{r.description}</p>}
                      {r.evidence && Object.keys(r.evidence).length > 0 && (
                        <pre className="text-xs text-gb-text-dark mt-1 bg-gb-surface p-2 rounded overflow-x-auto">
                          {JSON.stringify(r.evidence, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.agent_flags.length > 0 && (
                <div>
                  <p className="font-semibold text-gb-text-primary mb-2">Agent Flags ({selectedItem.agent_flags.length})</p>
                  {selectedItem.agent_flags.map((f) => (
                    <div key={f.id} className="bg-gb-bg p-3 rounded mb-2">
                      <p className="text-xs">{f.flag_type} · severity: {f.severity_score.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.dispute_events.length > 0 && (
                <div>
                  <p className="font-semibold text-gb-text-primary mb-2">Dispute Timeline</p>
                  {selectedItem.dispute_events.map((e) => (
                    <div key={e.id} className="bg-gb-bg p-3 rounded mb-2">
                      <p className="text-xs">{e.event_type} · {new Date(e.created_at).toLocaleString()}</p>
                      {e.content && <p className="text-xs text-gb-text-dark mt-1">{e.content.slice(0, 200)}</p>}
                      {e.credit_amount != null && <p className="text-xs text-green-400">Credits: {e.credit_amount}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {selectedItem.target_type.includes('agent') && selectedItem.status !== 'resolved' && (
                <div className="flex gap-2 pt-2 border-t border-gb-border">
                  {['dismiss', 'warn', 'suspend', 'ban'].map((action) => (
                    <button
                      key={action}
                      onClick={() => setActionModal({ itemId: selectedItem.id, type: action })}
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${
                        action === 'ban' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                        action === 'suspend' ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' :
                        action === 'warn' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                        'bg-gb-surface text-gb-text-muted hover:bg-gb-border'
                      }`}
                    >
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Action Confirmation Modal ── */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="gb-card p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gb-text-primary mb-4">
              Confirm: {actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)}
            </h3>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Reason (required)..."
              className="w-full bg-gb-bg border border-gb-border rounded-lg p-3 text-sm text-gb-text-primary resize-none h-24 mb-3"
            />
            {actionModal.type === 'suspend' && (
              <div className="mb-3">
                <label className="text-xs text-gb-text-muted block mb-1">Suspension duration (days)</label>
                <select
                  value={suspensionDays}
                  onChange={(e) => setSuspensionDays(Number(e.target.value))}
                  className="bg-gb-bg border border-gb-border rounded-lg px-3 py-1.5 text-sm text-gb-text-primary"
                >
                  {[7, 14, 30, 60, 90].map((d) => (
                    <option key={d} value={d}>{d} days</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setActionModal(null); setActionReason(''); }}
                className="px-4 py-2 text-sm text-gb-text-muted hover:text-gb-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionReason.trim().length < 5}
                className="px-4 py-2 text-sm bg-gb-accent text-white rounded-lg font-semibold disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
