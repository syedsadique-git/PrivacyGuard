import { useEffect, useState } from 'react';

export default function PrivacyScoreRing({ score, size = 'large', animate = true }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (animate) {
      let current = 0;
      const increment = score / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animate]);

  const getColor = () => {
    if (score < 40) return '#FF4D4D';
    if (score < 70) return '#FFA500';
    return '#00C853';
  };

  const getLabel = () => {
    if (score < 40) return 'At Risk';
    if (score < 70) return 'Fair';
    return 'Protected';
  };

  const dimensions = size === 'large'
    ? { outer: 200, stroke: 18 }
    : { outer: 120, stroke: 12 };

  const { outer, stroke } = dimensions;
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  const color = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: outer, height: outer }}>

        {/* Soft ambient glow behind the ring — no box */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent 68%)`,
            filter: 'blur(18px)',
          }}
        />

        <svg
          width={outer}
          height={outer}
          className="transform -rotate-90"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Track */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="#1A2942"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 4px ${color})`,
            }}
          />
        </svg>

        {/* Centre text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 2 }}
        >
          <span
            className={`font-mono font-bold ${size === 'large' ? 'text-5xl' : 'text-3xl'}`}
            style={{
              color,
              textShadow: `0 0 20px ${color}80, 0 0 8px ${color}40`,
            }}
          >
            {displayScore}
          </span>
          <span
            className={`uppercase tracking-wider ${size === 'large' ? 'text-sm' : 'text-xs'} mt-1`}
            style={{ color: `${color}99` }}
          >
            {getLabel()}
          </span>
        </div>
      </div>
    </div>
  );
}
