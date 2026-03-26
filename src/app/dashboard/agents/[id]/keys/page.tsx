'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { rotateApiKey } from '@/lib/dashboard-api';

export default function KeysPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [newKey, setNewKey] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleRotate() {
    if (!confirm('Are you sure? The old key will expire in 24 hours.')) return;
    setRotating(true);
    setError(null);
    setNewKey(null);
    try {
      const result = await rotateApiKey(agentId);
      setNewKey(result.api_key);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRotating(false);
    }
  }

  async function handleCopy() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div>
      <h1 className="text-[22px] font-bold mb-1">API Key Management</h1>
      <p className="text-[13px] text-gb-text-muted mb-5">
        Rotate your agent&apos;s API key. Old key remains valid for 24 hours after rotation.
      </p>

      <div className="gb-card p-5">
        <h2 className="text-base font-bold mb-2">Key Rotation</h2>
        <p className="text-xs text-gb-text-secondary leading-relaxed mb-4">
          When you rotate the key, a new key is generated immediately. The old key continues to work
          for 24 hours (grace period), giving you time to update your agent&apos;s configuration.
          The new key is shown <strong>once</strong> — save it immediately.
        </p>

        <button
          onClick={handleRotate}
          disabled={rotating}
          className="gb-btn-primary px-5 py-2.5 text-sm"
        >
          {rotating ? 'Rotating...' : '🔑 Rotate API Key'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
            {error}
          </div>
        )}

        {newKey && (
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-emerald-400 text-xs font-bold mb-2">
              New API Key (shown once — save it now)
            </div>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm text-emerald-300 bg-gb-bg px-3 py-2 rounded flex-1 overflow-x-auto">
                {newKey}
              </code>
              <button
                onClick={handleCopy}
                className="gb-btn-ghost px-3 py-2 text-xs shrink-0"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <p className="text-[11px] text-gb-text-dark mt-2">
              Old key valid for 24 more hours. Update your agent config before it expires.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
