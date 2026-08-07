import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, ArrowRight, RotateCcw } from 'lucide-react';

interface TeaserScreenProps {
  onPlayAgain: () => void;
}

export const TeaserScreen: React.FC<TeaserScreenProps> = ({ onPlayAgain }) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-4 flex flex-col items-center">
      {/* Full-bleed Poster Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full bg-[#241242] text-[#FFF3C4] border-[3px] border-[#FFFDF6] rounded-3xl p-6 sm:p-7 shadow-[8px_8px_0px_0px_#FF4D8D] text-center relative overflow-hidden mb-5 flex flex-col items-center"
      >
        {/* Eyebrow Tag */}
        <div
          lang="fa-AF"
          dir="rtl"
          className="inline-flex items-center justify-center bg-[#FF4D8D] text-white px-3.5 py-1 rounded-full text-xs font-black border-2 border-[#FFFDF6] shadow-[2px_2px_0px_0px_#00B89C] mb-3 tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5 ml-1.5" />
          <span>به زودی</span>
        </div>

        {/* Big Bold Headline Wordmark - COMPIX (Latin script) */}
        <h1 className="text-5xl sm:text-6xl font-black text-[#FFE066] font-['Baloo_Bhaijaan_2',sans-serif] tracking-wider uppercase leading-none my-1 drop-shadow-[3px_3px_0px_#FF4D8D]">
          COMPIX
        </h1>

        {/* Sub-line (Dari) */}
        <p
          lang="fa-AF"
          dir="rtl"
          className="text-lg sm:text-xl font-black text-white font-['Vazirmatn',sans-serif] my-2 text-center"
        >
          یک صنف پنج هفتهیی هوش مصنوعی
        </p>

        {/* Tagline Line (Dari) */}
        <p
          lang="fa-AF"
          dir="rtl"
          className="text-xs sm:text-sm font-bold text-[#FFF3C4] opacity-95 my-2 max-w-xs leading-relaxed text-center"
        >
          پروژههای واقعی هوش مصنوعی بساز. نیاز به تجربه نیست.
        </p>

        {/* Location Line (Dari) */}
        <div
          lang="fa-AF"
          dir="rtl"
          className="inline-flex items-center gap-1.5 bg-white/10 text-[#FFE066] px-3 py-1.5 rounded-xl border border-[#FFE066]/30 text-xs font-black my-2"
        >
          <MapPin className="w-3.5 h-3.5 text-[#FF4D8D] shrink-0" />
          <span>اکادمی محمد اسماعیل آزاد</span>
        </div>

        {/* Details Strip - 3 quick facts */}
        <div
          lang="fa-AF"
          dir="rtl"
          className="w-full bg-[#00B89C] text-[#241242] border-2 border-[#FFFDF6] rounded-2xl p-2.5 my-3 grid grid-cols-3 gap-1 shadow-[3px_3px_0px_0px_#FFF3C4]"
        >
          <div className="flex flex-col items-center justify-center p-1 text-center">
            <span className="text-[10px] font-bold text-[#241242]/80">دوره</span>
            <span className="text-xs font-black text-[#241242]">۵ هفته</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 text-center border-x-2 border-dashed border-[#241242]/30">
            <span className="text-[10px] font-bold text-[#241242]/80">تاریخ آغاز</span>
            <span className="text-[11px] font-black text-[#241242]">[تاریخ آغاز اینجا اضافه شود]</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1 text-center">
            <span className="text-[10px] font-bold text-[#241242]/80">شرایط</span>
            <span className="text-xs font-black text-[#241242]">ظرفیت محدود</span>
          </div>
        </div>

        {/* Closing Punch Line */}
        <p
          lang="fa-AF"
          dir="rtl"
          className="text-xs font-black text-[#FF4D8D] bg-[#FFE066]/10 px-3 py-1.5 rounded-lg border border-[#FF4D8D]/30 mb-4 text-center"
        >
          ظرفیت محدود است. از دست ندهید.
        </p>

        {/* Single Bold Action Button: معلومات بیشتر */}
        <button
          onClick={() => alert('معلومات بیشتر به‌زودی اضافه می‌شود.')}
          lang="fa-AF"
          dir="rtl"
          className="w-full py-3.5 px-6 bg-[#FF4D8D] text-white font-black text-sm sm:text-base font-['Vazirmatn',sans-serif] border-2 border-[#FFFDF6] rounded-xl shadow-[4px_4px_0px_0px_#FFE066] hover:bg-[#ff3377] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>معلومات بیشتر</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </motion.div>

      {/* Quiet, minor "Play again" link */}
      <button
        onClick={onPlayAgain}
        lang="fa-AF"
        dir="rtl"
        className="text-xs font-bold text-[#241242]/70 hover:text-[#241242] underline underline-offset-4 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-black/5 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>دوباره بازی کن</span>
      </button>
    </div>
  );
};

