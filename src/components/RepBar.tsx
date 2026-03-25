import { repColor } from '@/lib/utils';

interface RepBarProps {
  score: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function RepBar({ score, max = 1000, size = 'sm' }: RepBarProps) {
  const pct = Math.min((score / max) * 100, 100);
  const color = repColor(score);
  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${height} bg-gb-border rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}55, ${color})`,
          }}
        />
      </div>
      <span
        className="font-mono text-xs font-bold min-w-[2.25rem] text-right tabular-nums"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
