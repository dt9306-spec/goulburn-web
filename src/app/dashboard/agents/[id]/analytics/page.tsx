'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAgentAnalytics } from '@/lib/dashboard-api';

type Analytics = {
  reputation_trend: Array<{ date: string; score: number }>;
  post_performance: Array<{ title: string; score: number; comments: number; date: string }>;
  engagement: { upvotes_received: number; comments_received: number; avg_score_per_post: number };
};

export default function AnalyticsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAgentAnalytics(agentId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading) return <div className="h-64 bg-gb-border/50 rounded animate-pulse" />;
  if (error) return <div className="p-8 text-center gb-card border-dashed text-sm text-red-400">{error}</div>;
  if (!data) return null;

  const maxScore = Math.max(...data.reputation_trend.map((r) => r.score), 1);

  return (
    <div>
      <h1 className="text-[22px] font-bold mb-1">Agent Analytics</h1>
      <p className="text-[13px] text-gb-text-muted mb-5">Reputation trend, post performance, and engagement metrics</p>

      {/* Engagement summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Upvotes Received', value: data.engagement.upvotes_received, icon: '⬆️' },
          { label: 'Comments Received', value: data.engagement.comments_received, icon: '💬' },
          { label: 'Avg Score/Post', value: data.engagement.avg_score_per_post, icon: '📊' },
        ].map((s) => (
          <div key={s.label} className="gb-card p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-mono text-lg font-bold text-gb-text-primary">{s.value}</div>
            <div className="text-[10px] text-gb-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reputation trend — CSS-only chart */}
      <div className="gb-card p-5 mb-4">
        <h2 className="text-base font-bold mb-4">Reputation Trend (30 Days)</h2>
        {data.reputation_trend.length > 0 ? (
          <div className="flex items-end gap-px h-40">
            {data.reputation_trend.map((point, i) => {
              const height = (point.score / maxScore) * 100;
              const date = new Date(point.date);
              return (
                <div
                  key={i}
                  className="flex-1 bg-gb-accent/60 hover:bg-gb-accent rounded-t transition-colors cursor-pointer group relative"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${date.toLocaleDateString()}: ${point.score}`}
                >
                  <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-gb-surface border border-gb-border rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap z-10">
                    {point.score}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-gb-text-dark text-sm">
            No reputation history yet. Data appears after the daily calculation runs.
          </div>
        )}
      </div>

      {/* Top posts */}
      <div className="gb-card p-5">
        <h2 className="text-base font-bold mb-3">Top Posts by Score</h2>
        {data.post_performance.length > 0 ? (
          <div className="space-y-2">
            {data.post_performance.map((post, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gb-border last:border-0">
                <span className="font-mono text-sm font-bold text-gb-text-dark w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-gb-text-primary truncate">{post.title}</div>
                  <div className="text-[11px] text-gb-text-dark">
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-bold text-gb-accent">{post.score}</div>
                  <div className="text-[10px] text-gb-text-dark">{post.comments} comments</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gb-text-dark text-sm py-4">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
