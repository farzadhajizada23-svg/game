import { GameRoom, ScoreMatchResult, VerdictInfo } from '../types';
import { QUESTIONS } from '../data/questions';

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calculateSyncScore(room: GameRoom): {
  scorePercentage: number;
  totalMatches: number;
  matchResults: ScoreMatchResult[];
} {
  const p1 = room.player1;
  const p2 = room.player2;

  if (!p1 || !p2 || !p1.submitted || !p2.submitted) {
    return { scorePercentage: 0, totalMatches: 0, matchResults: [] };
  }

  let totalMatches = 0;
  const matchResults: ScoreMatchResult[] = [];

  QUESTIONS.forEach((q) => {
    const p1SelfOptId = p1.selfAnswers[q.id];
    const p2GuessOptId = p2.guessAnswers[q.id];

    const p2SelfOptId = p2.selfAnswers[q.id];
    const p1GuessOptId = p1.guessAnswers[q.id];

    const p1MatchesP2Guess = p1SelfOptId === p2GuessOptId;
    const p2MatchesP1Guess = p2SelfOptId === p1GuessOptId;

    if (p1MatchesP2Guess) totalMatches += 1;
    if (p2MatchesP1Guess) totalMatches += 1;

    const p1SelfOpt = q.options.find((o) => o.id === p1SelfOptId) || q.options[0];
    const p2GuessOpt = q.options.find((o) => o.id === p2GuessOptId) || q.options[0];

    const p2SelfOpt = q.options.find((o) => o.id === p2SelfOptId) || q.options[0];
    const p1GuessOpt = q.options.find((o) => o.id === p1GuessOptId) || q.options[0];

    matchResults.push({
      questionId: q.id,
      p1Self: p1SelfOpt,
      p2Guess: p2GuessOpt,
      p1MatchesP2Guess,
      p2Self: p2SelfOpt,
      p1Guess: p1GuessOpt,
      p2MatchesP1Guess,
    });
  });

  const scorePercentage = Math.round((totalMatches / 12) * 100);

  return {
    scorePercentage,
    totalMatches,
    matchResults,
  };
}

export function getVerdict(score: number): VerdictInfo {
  if (score >= 90) {
    return {
      minScore: 90,
      maxScore: 100,
      text: 'کاملاً یک روح در دو بدن 🧬',
      emoji: '🧬',
      badgeBg: 'bg-[#FF4D8D] text-white',
    };
  } else if (score >= 70) {
    return {
      minScore: 70,
      maxScore: 89,
      text: 'رفیق‌های تاییدشده و صمیمی 💫',
      emoji: '💫',
      badgeBg: 'bg-[#00B89C] text-white',
    };
  } else if (score >= 50) {
    return {
      minScore: 50,
      maxScore: 69,
      text: 'نسبتاً همگام و هماهنگ ✨',
      emoji: '✨',
      badgeBg: 'bg-[#FFE066] text-[#241242]',
    };
  } else if (score >= 30) {
    return {
      minScore: 30,
      maxScore: 49,
      text: 'هنوز در حال شناخت همدیگر 🌱',
      emoji: '🌱',
      badgeBg: 'bg-purple-200 text-[#241242]',
    };
  } else {
    return {
      minScore: 0,
      maxScore: 29,
      text: 'به طرز خنده‌داری متفاوت 😂',
      emoji: '😂',
      badgeBg: 'bg-pink-200 text-[#241242]',
    };
  }
}
