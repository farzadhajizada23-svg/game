import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Users, Sparkles, ArrowLeft } from 'lucide-react';
import { generateRoomCode } from '../lib/gameLogic';

interface LandingScreenProps {
  onStartGame: (name: string, code: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  initialCode?: string;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartGame,
  isLoading,
  errorMessage,
  initialCode,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState(initialCode || generateRoomCode());
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRefreshCode = () => {
    setCode(generateRoomCode());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanName) {
      setValidationError('لطفاً نام خود را وارد کنید.');
      return;
    }

    if (!cleanCode || cleanCode.length < 3) {
      setValidationError('لطفاً یک کد معتبر وارد کنید.');
      return;
    }

    await onStartGame(cleanName, cleanCode);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 py-6 flex flex-col items-center">
      {/* Header Banner / Logo */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full text-center mb-6"
      >
        <div className="inline-block bg-[#FF4D8D] text-white font-extrabold px-3 py-1 rounded-full text-xs mb-2 border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242] transform -rotate-2">
          بازی دو نفره شناخت دوستان 🐾
        </div>
        <h1 className="text-4xl font-extrabold text-[#241242] font-['Baloo_Bhaijaan_2',sans-serif] leading-tight drop-shadow-sm">
          همگامی دوستان
        </h1>
        <p className="text-[#241242]/80 text-sm font-semibold mt-1">
          چقدر دوستت را خوب می‌شناسی؟ با ۶ سوال بسنجید!
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full bg-[#FFFDF6] border-[3px] border-[#241242] rounded-3xl p-6 poster-shadow relative"
      >
        {/* Decorative Badge */}
        <div className="absolute -top-4 -left-2 bg-[#00B89C] text-white px-3 py-1 rounded-lg border-2 border-[#241242] shadow-[2px_2px_0px_0px_#241242] font-bold text-xs transform rotate-3 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>کد مشترک</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-bold text-[#241242] mb-1.5 text-right">
              نام شما:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: احمد، مریم، رفیق..."
              maxLength={20}
              className="w-full px-4 py-3 bg-white border-[2.5px] border-[#241242] rounded-xl text-[#241242] font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] placeholder:text-[#241242]/40 shadow-[2px_2px_0px_0px_#241242] transition-all"
            />
          </div>

          {/* Room Code Input */}
          <div>
            <label className="block text-sm font-bold text-[#241242] mb-1.5 text-right">
              کد اتاق بازی (۴ حرفی):
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="کد ۴ حرفی"
                maxLength={6}
                className="w-full px-4 py-3 bg-white border-[2.5px] border-[#241242] rounded-xl text-[#241242] font-extrabold text-xl tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] shadow-[2px_2px_0px_0px_#241242]"
              />
              <button
                type="button"
                onClick={handleRefreshCode}
                title="تولید کد جدید"
                className="absolute left-2 p-2 bg-[#FFE066] border-2 border-[#241242] rounded-lg hover:bg-[#ffd633] active:translate-y-0.5 shadow-[1px_1px_0px_0px_#241242] transition-all"
              >
                <RefreshCw className="w-4 h-4 text-[#241242]" />
              </button>
            </div>
            <p className="text-xs text-[#241242]/70 mt-1.5 text-right font-medium">
              اگر اولین نفر هستید کد جدید بسازید، وگرنه کد دوستتان را وارد کنید.
            </p>
          </div>

          {/* Validation & Server Error Messages */}
          {(validationError || errorMessage) && (
            <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-800 text-xs font-bold text-right shadow-[2px_2px_0px_0px_#241242]">
              {validationError || errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-[#FF4D8D] text-white font-black text-lg font-['Baloo_Bhaijaan_2',sans-serif] border-[3px] border-[#241242] rounded-xl shadow-[4px_4px_0px_0px_#241242] hover:bg-[#ff3377] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#241242] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                در حال ورود به بازی...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>بیا شروع کنیم!</span>
                <ArrowLeft className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>
      </motion.div>

      {/* How it works info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-[#FFFDF6]/80 border-2 border-[#241242] rounded-xl p-4 mt-6 text-right shadow-[3px_3px_0px_0px_#241242]"
      >
        <div className="flex items-center gap-2 text-xs font-black text-[#241242] mb-2">
          <Users className="w-4 h-4 text-[#00B89C]" />
          <span>مراحل بازی:</span>
        </div>
        <ol className="text-xs text-[#241242]/80 space-y-1 pr-4 list-decimal font-semibold">
          <li>پاسخ به ۶ سوال درباره خودتان با ایموجی حیوانات</li>
          <li>حدس زدن پاسخ‌های دوستتان به همان ۶ سوال</li>
          <li>مشاهده درصد همگامی و مقایسه نتایج دو نفره</li>
        </ol>
      </motion.div>
    </div>
  );
};
