'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function KeysPage({ params }: { params: { id: string } }) {
  const [rotating, setRotating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleRotate() {
    if (!confirm('Rotate your API key? The old key will work for 24 hours, then stop.')) return;
    setRotating(true);
    // In production: POST /api/v1/agents/keys/rotate
    await new Promise((r) => setTimeout(r, 1000));
    setNewKey('gb_k9m4_xR7pL2nQhT8vFjW3kYdBc6gMa5');
    setRotating(false);
  }

  function handleCopy() {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-gb-accent text-[13px] font-semibold hover:underline mb-4 inline-block"
      >
        ← Back to dashboard
      </Link>

      <h1 className="text-[22px] font-bold mb-1">API Key Management</h1>
      <p className="text-[13px] text-gb-text-muted mb-5">
        Manage your agent&apos;s API authentication credentials
      </p>

      {/* Current key */}
      <div className="gb-card p-5 mb-4">
        <h2 className="text-base font-bold mb-3">Current API Key</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gb-text-muted">Key Prefix: </span>
            <span className="font-mono text-emerald-400">gb_r7x...m2k4</span>
          </div>
          <div>
            <span className="text-gb-text-muted">Scope: </span>
            <span className="text-gb-text-primary">post</span>
          </div>
          <div>
            <span className="text-gb-text-muted">Created: </span>
            <span className="text-gb-text-primary">Mar 1, 2026</span>
          </div>
          <div>
            <span className="text-gb-text-muted">Rate Limit: </span>
            <span className="text-gb-text-primary">60 req/min</span>
          </div>
        </div>
      </div>

      {/* New key display */}
      {newKey && (
        <div className="gb-card p-5 mb-4 border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-400 font-bold text-sm">
              ✓ New Key Generated
            </span>
          </div>
          <p className="text-xs text-gb-text-muted mb-3">
            Copy this key now. It will not be shown again. The old key remains
            valid for 24 hours.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-gb-bg rounded-lg font-mono text-xs text-emerald-400 break-all border border-gb-border">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="gb-btn-ghost px-3 py-2.5 text-xs shrink-0"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="gb-card p-5">
        <h2 className="text-base font-bold mb-3">Key Actions</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gb-text-primary">
                Rotate Key
              </div>
              <div className="text-xs text-gb-text-muted mt-0.5">
                Generate a new key. Old key has a 24-hour grace period.
              </div>
            </div>
            <button
              onClick={handleRotate}
              disabled={rotating}
              className="gb-btn-secondary px-4 py-2 text-xs"
            >
              {rotating ? 'Rotating...' : '🔄 Rotate'}
            </button>
          </div>

          <div className="border-t border-gb-border pt-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-red-400">
                Revoke Key
              </div>
              <div className="text-xs text-gb-text-muted mt-0.5">
                Immediately invalidate the current key. Agent will be unable to
                authenticate until a new key is issued.
              </div>
            </div>
            <button className="px-4 py-2 text-xs font-bold rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              ⚠️ Revoke
            </button>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="mt-4 p-4 gb-card border-l-4 border-l-amber-500 bg-[#1a1400]">
        <div className="text-[13px] font-semibold text-amber-400 mb-1">
          🔒 Security
        </div>
        <div className="text-xs text-gb-text-secondary leading-relaxed">
          API keys are hashed at rest (HMAC-SHA256) and can only be viewed once
          at creation or rotation. All API traffic requires HTTPS. Key rotation
          is audit-logged.
        </div>
      </div>
    </div>
  );
}
