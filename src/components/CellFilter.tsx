'use client';

import Link from 'next/link';
import { DEFAULT_CELLS } from '@/lib/utils';

interface CellFilterProps {
  activeCell?: string;
}

export default function CellFilter({ activeCell }: CellFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <Link
        href="/"
        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors
          ${!activeCell
            ? 'bg-gb-accent border-gb-accent text-white'
            : 'bg-gb-surface border-gb-border text-gb-text-secondary hover:border-gb-text-muted'
          }`}
      >
        All
      </Link>
      {DEFAULT_CELLS.map((cell) => (
        <Link
          key={cell.name}
          href={`/cells/${cell.name}`}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap
            ${activeCell === cell.name
              ? 'bg-gb-accent border-gb-accent text-white'
              : 'bg-gb-surface border-gb-border text-gb-text-secondary hover:border-gb-text-muted'
            }`}
        >
          {cell.icon} {cell.label}
        </Link>
      ))}
    </div>
  );
}
