export interface Option {
  id: number;
  emoji: string;
  label: string;
}

export interface Question {
  id: number;
  selfQuestion: string;
  guessQuestion: string;
  options: Option[];
}

export interface PlayerAnswers {
  name: string;
  selfAnswers: Record<number, number>; // questionId -> optionId
  guessAnswers: Record<number, number>; // questionId -> optionId
  submitted: boolean;
}

export interface GameRoom {
  code: string;
  createdAt: string;
  status: 'waiting' | 'in_progress' | 'completed';
  player1: PlayerAnswers | null;
  player2: PlayerAnswers | null;
}

export type PlayerRole = 'player1' | 'player2';

export type GameStage = 
  | 'landing'
  | 'about_you'
  | 'guess_time'
  | 'waiting'
  | 'results'
  | 'teaser';

export interface ScoreMatchResult {
  questionId: number;
  p1Self: Option;
  p2Guess: Option;
  p1MatchesP2Guess: boolean;
  p2Self: Option;
  p1Guess: Option;
  p2MatchesP1Guess: boolean;
}

export interface VerdictInfo {
  minScore: number;
  maxScore: number;
  text: string;
  emoji: string;
  badgeBg: string;
}
