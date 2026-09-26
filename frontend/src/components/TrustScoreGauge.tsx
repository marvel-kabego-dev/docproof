import { useEffect, useRef, useState } from 'react';

export default function TrustScoreGauge({ score, previous }: { score: number; previous?: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const delta = previous === undefined ? 0 : score - previous;
  const label = score >= 90 ? 'Highly verified' : score >= 75 ? 'Mostly verified' : score >= 50 ? 'Needs attention' : 'Low confidence';

  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setDisplayScore(score); return; }

    const duration = 900;
    const start = performance.now();
    const from = 0;
    const to = score;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [score]);

  return (
    <div className="trust-gauge" aria-label={`Documentation Trust Score ${score} out of 100`}>
      <svg viewBox="0 0 140 140" role="img" aria-hidden="true">
        <circle className="gauge-track" cx="70" cy="70" r={radius} />
        <circle
          className="gauge-progress"
          cx="70"
          cy="70"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-copy"><strong>{displayScore}</strong><span>/100</span></div>
      <div className="gauge-label">{label}</div>
      {previous !== undefined && delta !== 0 && (
        <div className={`score-delta ${delta > 0 ? 'positive' : 'negative'}`}>
          {delta > 0 ? '+' : ''}{delta} since previous run
        </div>
      )}
    </div>
  );
}
