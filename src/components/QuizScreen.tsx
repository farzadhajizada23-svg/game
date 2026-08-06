import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS } from '../data/questions';
import { Option } from '../types';
import { CheckCircle2, User, HeartHandshake } from 'lucide-react';

interface QuizScreenProps {
  round: 'about_you' | 'guess_time';
  playerName: string;
  friendName?: string;
  onFinishRound: (answers: Record<number, number>) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  round,
  playerName,
  friendName,
  onFinishRound,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;

  const isSelfRound = round === 'about_you';

  const handleSelectOption = (option: Option) => {
    setSelectedOptionId(option.id);

    // Brief delay so user sees selection pulse
    setTimeout(() => {
      const newAnswers = { ...answers, [currentQuestion.id]: option.id };
      setAnswers(newAnswers);
      setSelectedOptionId(null);

      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onFinishRound(newAnswers);
      }
    }, 250);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top Banner / Round Indicator */}
      <div className="w-full mb-4 flex items-center justify-between">
        <div
          className={`px-3 py-1.5 rounded-xl border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242] font-black text-xs flex items-center gap-1.5 ${
            isSelfRound ? 'bg-[#FF4D8D] text-white' : 'bg-[#00B89C] text-white'
          }`}
        >
          {isSelfRound ? (
            <>
              <User className="w-4 h-4" />
              <span>مرحله ۱: درباره خودت</span>
            </>
          ) : (
            <>
              <HeartHandshake className="w-4 h-4" />
              <span>مرحله ۲: حدس زدن درباره دوستت</span>
            </>
          )}
        </div>

        <div className="text-xs font-extrabold text-[#241242] bg-[#FFFDF6] px-3 py-1 rounded-lg border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242]">
          سوال {currentIndex + 1} از {totalQuestions}
        </div>
      </div>

      {/* Progress Bar Dots */}
      <div className="w-full bg-[#FFFDF6] border-2 border-[#241242] rounded-xl p-2 mb-4 shadow-[3px_3px_0px_0px_#241242] flex justify-between items-center px-4">
        {QUESTIONS.map((q, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={q.id}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 border-[#241242] transition-all ${
                isDone
                  ? 'bg-[#00B89C] text-white'
                  : isCurrent
                  ? 'bg-[#FF4D8D] text-white scale-110 shadow-[1px_1px_0px_0px_#241242]'
                  : 'bg-white text-[#241242]/40'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
            </div>
          );
        })}
      </div>

      {/* Question Card Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${round}-${currentIndex}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-[#FFFDF6] border-[3px] border-[#241242] rounded-3xl p-5 poster-shadow"
        >
          {/* Question Text */}
          <div className="mb-6 text-right">
            <span className="text-xs font-bold text-[#FF4D8D] bg-pink-100 px-2.5 py-0.5 rounded-md border border-[#241242] inline-block mb-2">
              {isSelfRound
                ? `پاسخ توسط ${playerName}`
                : `حدس ${playerName} درباره ${friendName || 'دوستت'}`}
            </span>
            <h2 className="text-xl font-extrabold text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif] leading-snug">
              {isSelfRound
                ? currentQuestion.selfQuestion
                : currentQuestion.guessQuestion}
            </h2>
          </div>

          {/* 4 Animal Emoji Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full p-3.5 rounded-xl border-[2.5px] border-[#241242] text-right font-bold text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFE066] shadow-[1px_1px_0px_0px_#241242] translate-x-0.5 translate-y-0.5'
                      : 'bg-white hover:bg-amber-50 shadow-[3px_3px_0px_0px_#241242] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#241242]'
                  }`}
                >
                  <span className="text-2xl p-1 bg-[#FFE066]/40 rounded-lg border border-[#241242]/20">
                    {option.emoji}
                  </span>
                  <span className="text-[#241242] font-bold text-base flex-1">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
