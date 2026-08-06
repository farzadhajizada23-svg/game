import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ScoreGauge } from './ScoreGauge';
import { GameRoom } from '../types';
import { QUESTIONS } from '../data/questions';
import { calculateSyncScore, getVerdict } from '../lib/gameLogic';
import { Sparkles, ArrowLeft, Check, X, Award } from 'lucide-react';

interface ResultsScreenProps {
  room: GameRoom;
  currentPlayerRole: 'player1' | 'player2';
  onGoToTeaser: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  room,
  currentPlayerRole,
  onGoToTeaser,
}) => {
  const p1 = room.player1;
  const p2 = room.player2;

  const { scorePercentage, totalMatches, matchResults } = calculateSyncScore(room);
  const verdict = getVerdict(scorePercentage);

  useEffect(() => {
    if (scorePercentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4D8D', '#00B89C', '#FFE066', '#241242'],
      });
    }
  }, [scorePercentage]);

  if (!p1 || !p2) {
    return null;
  }

  const p1Name = p1.name;
  const p2Name = p2.name;

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-6 flex flex-col items-center">
      {/* Header Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full text-center mb-4"
      >
        <div className="inline-flex items-center gap-1.5 bg-[#00B89C] text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242] mb-2">
          <Award className="w-4 h-4" />
          <span>نتیجه نهایی همگامی</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif]">
          {p1Name} & {p2Name}
        </h1>
      </motion.div>

      {/* Main Score Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-[#FFFDF6] border-[3px] border-[#241242] rounded-3xl p-5 poster-shadow text-center mb-6"
      >
        {/* Gauge */}
        <ScoreGauge score={scorePercentage} />

        {/* Verdict Box */}
        <div className="mt-2 p-3 bg-[#FFE066] border-2 border-[#241242] rounded-xl shadow-[3px_3px_0px_0px_#241242]">
          <div className="text-xs font-bold text-[#241242]/70 mb-0.5">
            ارزیابی صمیمیت و شناخت:
          </div>
          <div className="text-xl font-black text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif]">
            {verdict.text}
          </div>
          <div className="text-xs font-bold text-[#241242]/80 mt-1">
            {totalMatches} پاسخ درست از ۱۲ پاسخ حدس‌زده‌شده
          </div>
        </div>
      </motion.div>

      {/* Breakdown Header */}
      <div className="w-full text-right mb-3 flex items-center justify-between">
        <h3 className="text-lg font-black text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF4D8D]" />
          <span>بررسی سوال به سوال:</span>
        </h3>
      </div>

      {/* Questions Breakdown List */}
      <div className="w-full space-y-4 mb-6">
        {matchResults.map((res, index) => {
          const q = QUESTIONS.find((item) => item.id === res.questionId)!;

          return (
            <motion.div
              key={res.questionId}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              className="bg-[#FFFDF6] border-[2.5px] border-[#241242] rounded-xl p-4 shadow-[4px_4px_0px_0px_#241242] text-right"
            >
              <div className="text-xs font-bold text-[#FF4D8D] mb-1">
                سوال {index + 1}: {q.selfQuestion}
              </div>

              <div className="grid grid-cols-1 gap-2.5 mt-3 pt-2 border-t-2 border-dashed border-[#241242]/20">
                {/* Comparison 1: P2 guessing P1 */}
                <div
                  className={`p-2.5 rounded-lg border-2 border-[#241242] flex items-center justify-between gap-2 text-xs font-bold ${
                    res.p1MatchesP2Guess
                      ? 'bg-emerald-100/80 text-emerald-900 border-emerald-800'
                      : 'bg-rose-100/80 text-rose-900 border-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {res.p1MatchesP2Guess ? (
                      <span className="bg-emerald-600 text-white p-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="bg-rose-600 text-white p-1 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span>
                      حدس {p2Name} درباره {p1Name}
                    </span>
                  </div>

                  <div className="text-left font-bold dir-ltr flex items-center gap-1">
                    <span>
                      {res.p1Self.emoji} واقعی: {res.p1Self.label.split(' ')[0]}
                    </span>
                    {!res.p1MatchesP2Guess && (
                      <span className="opacity-70 line-through">
                        ({res.p2Guess.emoji})
                      </span>
                    )}
                  </div>
                </div>

                {/* Comparison 2: P1 guessing P2 */}
                <div
                  className={`p-2.5 rounded-lg border-2 border-[#241242] flex items-center justify-between gap-2 text-xs font-bold ${
                    res.p2MatchesP1Guess
                      ? 'bg-emerald-100/80 text-emerald-900 border-emerald-800'
                      : 'bg-rose-100/80 text-rose-900 border-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {res.p2MatchesP1Guess ? (
                      <span className="bg-emerald-600 text-white p-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="bg-rose-600 text-white p-1 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span>
                      حدس {p1Name} درباره {p2Name}
                    </span>
                  </div>

                  <div className="text-left font-bold dir-ltr flex items-center gap-1">
                    <span>
                      {res.p2Self.emoji} واقعی: {res.p2Self.label.split(' ')[0]}
                    </span>
                    {!res.p2MatchesP1Guess && (
                      <span className="opacity-70 line-through">
                        ({res.p1Guess.emoji})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Button to Teaser Screen */}
      <button
        onClick={onGoToTeaser}
        className="w-full py-4 px-6 bg-[#FF4D8D] text-white font-black text-lg font-['Baloo_Bhaijaan_2',sans-serif] border-[3px] border-[#241242] rounded-xl shadow-[4px_4px_0px_0px_#241242] hover:bg-[#ff3377] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#241242] transition-all flex items-center justify-center gap-2 cursor-pointer mb-6"
      >
        <span>مشاهده اطلاعیه صنف‌های جدید 🚀</span>
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
};
