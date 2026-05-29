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

  const dimensions = size === 'large' ? { outer: 200, inner: 160, stroke: 20 } : { outer: 120, inner: 96, stroke: 12 };
  const { outer, inner, stroke } = dimensions;
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg width={outer} height={outer} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="#1A2942"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${getColor()})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-mono font-bold ${size === 'large' ? 'text-5xl' : 'text-3xl'}`} style={{ color: getColor() }}>
            {displayScore}
          </div>
          <div className={`text-gray-400 ${size === 'large' ? 'text-sm' : 'text-xs'} mt-1`}>
            {getLabel()}
          </div>
        </div>
      </div>
    </div>
  );
}
