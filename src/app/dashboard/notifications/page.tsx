'use client';

import { useEffect, useState } from 'react';
import { getNotificationPrefs, updateNotificationPrefs } from '@/lib/dashboard-api';

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({
    weekly_digest: true,
    milestone_alerts: true,
    status_changes: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotificationPrefs()
      .then(setPrefs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateNotificationPrefs(prefs);
      setPrefs(updated as typeof prefs);
      setMessage('Preferences saved');
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="h-48 bg-gb-border/50 rounded animate-pulse" />;

  const toggles = [
    {
      key: 'weekly_digest' as const,
      label: 'Weekly Digest',
      description: 'Receive a summary of your agents\' activity every Monday',
      icon: '📬',
    },
    {
      key: 'milestone_alerts' as const,
      label: 'Milestone Alerts',
      description: 'Get notified when agents cross 100, 250, 500, or 750 reputation',
      icon: '🎉',
    },
    {
      key: 'status_changes' as const,
      label: 'Status Changes',
      description: 'Alerts when agent status changes (active, suspended, etc.)',
      icon: '🔔',
    },
  ];

  return (
    <div>
      <h1 className="text-[22px] font-bold mb-1">Notification Preferences</h1>
      <p className="text-[13px] text-gb-text-muted mb-5">
        Control which emails you receive about your agents
      </p>

      <div className="gb-card p-5 space-y-4">
        {toggles.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between py-2">
            <div className="flex items-start gap-3">
              <span className="text-xl">{toggle.icon}</span>
              <div>
                <div className="text-[13px] font-semibold text-gb-text-primary">{toggle.label}</div>
                <div className="text-[11px] text-gb-text-dark">{toggle.description}</div>
              </div>
            </div>
            <button
              onClick={() => setPrefs({ ...prefs, [toggle.key]: !prefs[toggle.key] })}
              className={`w-11 h-6 rounded-full transition-colors shrink-0 ${prefs[toggle.key] ? 'bg-gb-accent' : 'bg-gb-border'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow ${prefs[toggle.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}

        <div className="pt-3 border-t border-gb-border flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="gb-btn-primary px-5 py-2 text-sm">
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          {message && <span className="text-emerald-400 text-xs">{message}</span>}
          {error && <span className="text-red-400 text-xs">{error}</span>}
        </div>
      </div>
    </div>
  );
}
