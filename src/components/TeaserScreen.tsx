import React from 'react';
import { motion } from 'motion/react';
import { Rocket, RotateCcw, Calendar, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

interface TeaserScreenProps {
  onPlayAgain: () => void;
}

export const TeaserScreen: React.FC<TeaserScreenProps> = ({ onPlayAgain }) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-8 flex flex-col items-center">
      {/* Poster Style Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full bg-[#FFFDF6] border-[3px] border-[#241242] rounded-3xl p-6 poster-shadow text-center relative overflow-hidden mb-6"
      >
        {/* Top Decorative Sticker */}
        <div className="inline-flex items-center gap-1.5 bg-[#FF4D8D] text-white px-3.5 py-1 rounded-full text-xs font-black border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242] mb-4 transform -rotate-2">
          <Rocket className="w-4 h-4" />
          <span>خبر ویژه و فوری! 📣</span>
        </div>

        {/* Announcement Title */}
        <h2 className="text-3xl font-extrabold text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif] leading-snug mb-2">
          صنف‌های جدید در راه است! 🚀
        </h2>

        <p className="text-xs font-bold text-[#241242]/70 mb-6">
          فرصت فوق‌العاده برای ارتقای دانش و مهارت‌های شما
        </p>

        {/* Class Placeholder Banner */}
        <div className="bg-[#FFE066] border-[2.5px] border-[#241242] rounded-xl p-5 shadow-[4px_4px_0px_0px_#241242] text-right space-y-3 mb-6 relative">
          <div className="flex items-start gap-2">
            <GraduationCap className="w-6 h-6 text-[#241242] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold text-[#FF4D8D] bg-white px-2 py-0.5 rounded border border-[#241242]">
                نام صنف آموزشی
              </span>
              <h3 className="text-lg font-black text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif] mt-1">
                دوره تخصصی برنامه‌نویسی وب و هوش مصنوعی 💡
              </h3>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-dashed border-[#241242]/30 flex items-center justify-between text-xs font-extrabold text-[#241242]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#00B89C]" />
              <span>تاریخ شروع: ۱۰ سنبله ۱۴۰۵</span>
            </div>

            <div className="flex items-center gap-1 bg-[#00B89C] text-white px-2 py-0.5 rounded border border-[#241242]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ثبت‌نام به‌زودی</span>
            </div>
          </div>
        </div>

        {/* Additional Features / Highlights */}
        <div className="bg-white border-2 border-[#241242] rounded-xl p-4 shadow-[3px_3px_0px_0px_#241242] text-right space-y-2 mb-2">
          <div className="text-xs font-extrabold text-[#241242] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF4D8D]" />
            <span>ویژگی‌های صنف جدید:</span>
          </div>
          <ul className="text-xs text-[#241242]/80 space-y-1 pr-4 list-disc font-semibold">
            <li>آموزش پروژه‌محور و کاربردی</li>
            <li>پشتیبانی آنلاین و تمرین‌های تعاملی</li>
            <li>اعطای گواهینامه معتبر پایان دوره</li>
          </ul>
        </div>
      </motion.div>

      {/* Play Again Button */}
      <button
        onClick={onPlayAgain}
        className="w-full py-4 px-6 bg-[#00B89C] text-white font-black text-lg font-['Baloo_Bhaijaan_2',sans-serif] border-[3px] border-[#241242] rounded-xl shadow-[4px_4px_0px_0px_#241242] hover:bg-[#00a088] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#241242] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>دوباره بازی کن (اتاق جدید) 🔄</span>
      </button>
    </div>
  );
};
