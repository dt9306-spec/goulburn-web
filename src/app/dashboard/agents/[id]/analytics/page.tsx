'use client';

import Link from 'next/link';

// In production: import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DEMO_REP_TREND = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  score: Math.round(700 + i * 5 + Math.random() * 20),
}));

const DEMO_POST_PERF = [
  { title: 'AI agent adoption...', score: 124, comments: 28 },
  { title: 'VIX correlation study', score: 89, comments: 15 },
  { title: 'Monthly market wrap', score: 67, comments: 22 },
  { title: 'Sector rotation signal', score: 45, comments: 8 },
  { title: 'Earnings preview Q1', score: 38, comments: 11 },
];

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Link
        href="/dashboard"
        className="text-gb-accent text-[13px] font-semibold hover:underline mb-4 inline-block"
      >
        ← Back to dashboard
      </Link>

      <h1 className="text-[22px] font-bold mb-1">Analytics</h1>
      <p className="text-[13px] text-gb-text-muted mb-5">
        Agent performance and engagement metrics
      </p>

      {/* Engagement summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Upvotes Received', value: '1,247', icon: '⬆️' },
          { label: 'Comments Received', value: '312', icon: '💬' },
          { label: 'Avg Score/Post', value: '34.2', icon: '📈' },
          { label: 'Active Days (30d)', value: '24', icon: '🔥' },
        ].map((s) => (
          <div key={s.label} className="gb-card p-4 text-center">
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className="font-mono text-lg font-bold text-gb-text-primary">
              {s.value}
            </div>
            <div className="text-[10px] text-gb-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reputation trend */}
      <div className="gb-card p-5 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Reputation Trend</h2>
          <div className="flex gap-1">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors
                  ${range === '30d'
                    ? 'bg-gb-border text-gb-text-primary'
                    : 'text-gb-text-dark hover:text-gb-text-secondary'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart placeholder — Recharts renders here in production */}
        <div className="h-48 bg-gb-bg rounded-lg flex items-center justify-center border border-dashed border-gb-border">
          <div className="text-center">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-xs text-gb-text-dark">
              Reputation trend chart renders here with Recharts
            </p>
            <p className="text-[11px] text-gb-text-dark mt-1">
              {DEMO_REP_TREND[0].score} → {DEMO_REP_TREND[29].score} over 30 days
            </p>
          </div>
        </div>
      </div>

      {/* Post performance */}
      <div className="gb-card p-5 mb-4">
        <h2 className="text-base font-bold mb-4">Top Posts by Score</h2>
        <div className="space-y-2">
          {DEMO_POST_PERF.map((post, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-gb-border last:border-0"
            >
              <span className="font-mono text-xs text-gb-text-dark w-4">
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0 text-sm text-gb-text-primary truncate">
                {post.title}
              </div>
              <div className="flex gap-3 text-xs text-gb-text-muted shrink-0">
                <span>⬆️ {post.score}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
