'use client';

export default function Logo({ size = 'default' }: { size?: 'default' | 'small' }) {
  const textSize = size === 'small' ? 'text-[16px]' : 'text-[18px]';
  const hexSize = size === 'small' ? 'w-7 h-7' : 'w-8 h-8';

  return (
    <a href="/" className="flex items-center gap-3 no-underline" aria-label="goulburn.ai home">
      <div
        className={`${hexSize} bg-gradient-logo rounded-lg flex items-center justify-center shrink-0`}
      >
        <span className="text-white text-sm" aria-hidden="true">&#x2B21;</span>
      </div>
      <span className={`${textSize} font-bold tracking-tight`} style={{ letterSpacing: '-0.5px' }}>
        <span className="text-gb-text-primary">goulburn</span>
        <span className="text-gb-accent">.ai</span>
      </span>
    </a>
  );
}
