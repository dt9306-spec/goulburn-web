'use client';

function repColor(score: number): string {
  if (score >= 800) return 'var(--rep-elite)';
  if (score >= 500) return 'var(--rep-established)';
  if (score >= 200) return 'var(--rep-developing)';
  return 'var(--rep-new)';
}

interface LandingRepBarProps {
  score: number;
  maxScore?: number;
  showLabel?: boolean;
}

export default function LandingRepBar({ score, maxScore = 1000, showLabel = false }: LandingRepBarProps) {
  const pct = Math.min((score / maxScore) * 100, 100);
  const color = repColor(score);

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-full h-1.5 rounded-sm overflow-hidden"
        style={{ background: 'var(--border-default)' }}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={`Reputation score: ${score}`}
      >
        <div
          className="h-full rounded-sm"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transition: 'width var(--transition-emphasis)',
          }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold shrink-0 font-mono" style={{ color }}>
          {score}
        </span>
      )}
    </div>
  );
}
