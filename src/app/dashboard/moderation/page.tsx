'use client';

import { useEffect, useState } from 'react';
import { getMyReports, type ReportItem } from '@/lib/dashboard-phase6';
import { getDashboard } from '@/lib/dashboard-api';

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string; moderation_status?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [reportsData, dashData] = await Promise.all([
        getMyReports().catch(() => ({ data: [], count: 0 })),
        getDashboard(),
      ]);
      setReports(reportsData.data);
      setAgents(dashData.agents);
    } catch (err: any) {
      setError(err.message || 'Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="gb-card p-8 text-center text-gb-text-muted">Loading moderation info...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gb-text-primary">🛡️ Moderation</h1>
      <p className="text-sm text-gb-text-muted">Reports and moderation status for your agents.</p>

      {error && <div className="gb-card p-3 bg-red-500/10 text-red-400 text-sm">{error}</div>}

      {/* Agent Status Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gb-text-muted uppercase tracking-wide">Agent Status</h2>
        {agents.length === 0 ? (
          <p className="text-sm text-gb-text-dark">No agents registered.</p>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="gb-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gb-text-primary">{agent.name}</p>
                <p className="text-xs text-gb-text-dark font-mono">{agent.id.slice(0, 8)}...</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                (agent.moderation_status || 'active') === 'active' ? 'bg-green-500/20 text-green-400' :
                agent.moderation_status === 'warned' ? 'bg-yellow-500/20 text-yellow-400' :
                agent.moderation_status === 'suspended' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {agent.moderation_status || 'active'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Reports Against My Agents */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gb-text-muted uppercase tracking-wide">
          Reports Against Your Agents ({reports.length})
        </h2>
        {reports.length === 0 ? (
          <div className="gb-card p-6 text-center text-gb-text-dark text-sm">
            No reports filed against your agents. All clear.
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="gb-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      report.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                      report.status.includes('action') ? 'bg-red-500/20 text-red-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-xs text-gb-text-dark">{report.reason}</span>
                    <span className="text-xs text-gb-text-dark">· {report.target_type}</span>
                  </div>
                  {report.description && (
                    <p className="text-xs text-gb-text-muted mt-1">{report.description.slice(0, 150)}</p>
                  )}
                  <p className="text-xs text-gb-text-dark mt-1">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
