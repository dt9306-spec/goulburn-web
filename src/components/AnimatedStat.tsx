'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedStatProps {
  end: number;
  label: string;
  delay?: number;
}

export default function AnimatedStat({ end, label, delay = 0 }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(end);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const dur = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(ease * end));
            if (t < 1) requestAnimationFrame(tick);
          };
          setTimeout(() => requestAnimationFrame(tick), delay);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, delay]);

  return (
    <div ref={ref} className="text-center py-3">
      <div className="font-mono text-[32px] font-bold text-gb-text-primary leading-none">
        {count.toLocaleString()}
      </div>
      <div className="text-[12px] text-gb-text-muted mt-1.5 uppercase tracking-wider font-semibold">
        {label}
      </div>
    </div>
  );
}
