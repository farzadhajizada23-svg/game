import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Hourglass, Share2 } from 'lucide-react';

interface WaitingScreenProps {
  roomCode: string;
  playerName: string;
  friendName?: string;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  roomCode,
  playerName,
  friendName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?code=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-8 flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-[#FFFDF6] border-[3px] border-[#241242] rounded-3xl p-6 poster-shadow text-center"
      >
        {/* Animated Loading Spinner Graphic */}
        <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="w-full h-full border-[4px] border-dashed border-[#FF4D8D] rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ⏳
            </motion.span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif] mb-1">
          پاسخ‌های شما ثبت شد! 🎉
        </h2>

        <p className="text-sm font-bold text-[#241242]/80 mb-6">
          {friendName
            ? `در حال انتظار برای پاسخ‌های ${friendName}...`
            : 'در حال انتظار برای ورود و پاسخ‌دهی دوستتان...'}
        </p>

        {/* Room Code & Invite Link Box */}
        <div className="bg-[#FFE066] border-2 border-[#241242] rounded-xl p-4 shadow-[3px_3px_0px_0px_#241242] mb-4 text-right">
          <div className="text-xs font-black text-[#241242] mb-1">
            کد اختصاصی بازی شما:
          </div>
          <div className="flex items-center justify-between gap-2 bg-white border-2 border-[#241242] px-3 py-2 rounded-lg mb-3">
            <span className="font-black text-2xl tracking-widest text-[#241242]">
              {roomCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 bg-[#00B89C] text-white text-xs font-bold rounded-md border border-[#241242] shadow-[1px_1px_0px_0px_#241242] hover:bg-[#00a088] active:translate-y-0.5"
            >
              {copied ? 'کپی شد! ✓' : 'کپی کد'}
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 bg-[#FF4D8D] text-white font-bold text-xs rounded-lg border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242] flex items-center justify-center gap-2 hover:bg-[#ff3377] active:translate-y-0.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>لینک بازی کپی شد!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>ارسال لینک دعوت به دوستت</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#241242]/70 animate-pulse">
          <Hourglass className="w-4 h-4" />
          <span>به محض تکمیل پاسخ‌ها توسط دوستتان، نتیجه نمایش داده می‌شود...</span>
        </div>
      </motion.div>
    </div>
  );
};
