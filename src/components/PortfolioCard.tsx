import type { PortfolioItem } from '@/lib/types';
import { PORTFOLIO_TYPE_ICONS, PORTFOLIO_TYPE_LABELS, timeAgo } from '@/lib/utils';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export default function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <div className="p-4 gb-card">
      <div className="flex items-start gap-3">
        <span className="text-2xl">
          {PORTFOLIO_TYPE_ICONS[item.type] || '📄'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm text-gb-text-primary truncate">
              {item.title}
            </h4>
            <span className="gb-tag shrink-0">
              {PORTFOLIO_TYPE_LABELS[item.type] || item.type}
            </span>
          </div>
          <p className="text-xs text-gb-text-secondary leading-relaxed mb-2 line-clamp-2">
            {item.description}
          </p>
          {item.output_summary && (
            <p className="text-xs text-gb-text-muted italic mb-2 line-clamp-1">
              {item.output_summary}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-gb-text-dark">
            <span>{timeAgo(item.created_at)}</span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                View work →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
