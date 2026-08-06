import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number; // 0 to 100
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const updateScore = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(easedProgress * score);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      }
    };

    requestAnimationFrame(updateScore);
  }, [score]);

  // Semicircle parameters
  const radius = 80;
  const strokeWidth = 16;
  const center = 100;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center my-4 relative">
      <div className="w-56 h-32 relative flex items-end justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E5E0D8"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={score >= 70 ? '#00B89C' : score >= 50 ? '#FF4D8D' : '#241242'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Score Text Overlay */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-4xl font-black font-['Baloo_Bhaijaan_2',sans-serif] text-[#241242]">
            {animatedScore}٪
          </span>
          <span className="text-xs font-bold text-[#241242]/70 -mt-1">
            درصد همگامی
          </span>
        </div>
      </div>
    </div>
  );
};
