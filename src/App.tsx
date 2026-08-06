import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { GameRoom, GameStage, PlayerRole } from './types';
import { generateRoomCode } from './lib/gameLogic';
import { LandingScreen } from './components/LandingScreen';
import { QuizScreen } from './components/QuizScreen';
import { WaitingScreen } from './components/WaitingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { TeaserScreen } from './components/TeaserScreen';

export default function App() {
  const [stage, setStage] = useState<GameStage>('landing');
  const [playerName, setPlayerName] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerRole, setPlayerRole] = useState<PlayerRole | null>(null);
  const [roomData, setRoomData] = useState<GameRoom | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Temporary local answers during quiz rounds
  const [selfAnswers, setSelfAnswers] = useState<Record<number, number>>({});

  // Check URL for prefilled invitation code
  const [initialCode, setInitialCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code');
    if (codeFromUrl) {
      setInitialCode(codeFromUrl.toUpperCase());
    }
  }, []);

  // Listen to room document updates in real time when in waiting or results stage
  useEffect(() => {
    if (!roomCode || (stage !== 'waiting' && stage !== 'results')) {
      return;
    }

    const roomRef = doc(db, 'rooms', roomCode);

    // Snapshot listener
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as GameRoom;
          setRoomData(data);

          // If both players have submitted, go to results
          if (
            data.player1?.submitted &&
            data.player2?.submitted &&
            stage === 'waiting'
          ) {
            setStage('results');
          }
        }
      },
      (error) => {
        console.error('Snapshot listener error:', error);
      }
    );

    // Fallback polling every 2.5s for stability
    const intervalId = setInterval(async () => {
      try {
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          const data = snap.data() as GameRoom;
          setRoomData(data);

          if (
            data.player1?.submitted &&
            data.player2?.submitted &&
            stage === 'waiting'
          ) {
            setStage('results');
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [roomCode, stage]);

  // Start or Join Game Logic
  const handleStartGame = async (name: string, code: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const roomRef = doc(db, 'rooms', code);
      const roomSnap = await getDoc(roomRef);

      setPlayerName(name);
      setRoomCode(code);

      if (!roomSnap.exists()) {
        // Create new room as Player 1
        const newRoom: GameRoom = {
          code,
          createdAt: new Date().toISOString(),
          status: 'waiting',
          player1: {
            name,
            selfAnswers: {},
            guessAnswers: {},
            submitted: false,
          },
          player2: null,
        };

        await setDoc(roomRef, newRoom);
        setRoomData(newRoom);
        setPlayerRole('player1');
        setStage('about_you');
      } else {
        const existingData = roomSnap.data() as GameRoom;

        // Check if rejoining as Player 1
        if (
          existingData.player1 &&
          existingData.player1.name.trim().toLowerCase() === name.trim().toLowerCase()
        ) {
          setRoomData(existingData);
          setPlayerRole('player1');
          setStage(existingData.player1.submitted ? 'waiting' : 'about_you');
        }
        // Check if rejoining as Player 2
        else if (
          existingData.player2 &&
          existingData.player2.name.trim().toLowerCase() === name.trim().toLowerCase()
        ) {
          setRoomData(existingData);
          setPlayerRole('player2');
          setStage(existingData.player2.submitted ? 'waiting' : 'about_you');
        }
        // Check if Player 2 slot is available
        else if (!existingData.player2) {
          const updatedRoom: Partial<GameRoom> = {
            status: 'in_progress',
            player2: {
              name,
              selfAnswers: {},
              guessAnswers: {},
              submitted: false,
            },
          };

          await updateDoc(roomRef, updatedRoom);

          const fullUpdatedRoom: GameRoom = {
            ...existingData,
            status: 'in_progress',
            player2: {
              name,
              selfAnswers: {},
              guessAnswers: {},
              submitted: false,
            },
          };

          setRoomData(fullUpdatedRoom);
          setPlayerRole('player2');
          setStage('about_you');
        } else {
          // Room is full with 2 players
          setErrorMessage(
            'این کد اتاق قبلاً دو بازیکن دارد. لطفاً یک کد جدید تولید کنید یا کد دیگری وارد نمایید.'
          );
        }
      }
    } catch (err) {
      console.error('Error starting game:', err);
      setErrorMessage(
        'خطا در اتصال به شبکه. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Round 1 completed ("About you")
  const handleFinishSelfRound = (answers: Record<number, number>) => {
    setSelfAnswers(answers);
    setStage('guess_time');
  };

  // Round 2 completed ("Guess time") -> Save to Firestore & Go to Waiting
  const handleFinishGuessRound = async (guessAnswers: Record<number, number>) => {
    if (!roomCode || !playerRole) return;

    setIsLoading(true);

    try {
      const roomRef = doc(db, 'rooms', roomCode);

      if (playerRole === 'player1') {
        await updateDoc(roomRef, {
          'player1.selfAnswers': selfAnswers,
          'player1.guessAnswers': guessAnswers,
          'player1.submitted': true,
        });
      } else {
        await updateDoc(roomRef, {
          'player2.selfAnswers': selfAnswers,
          'player2.guessAnswers': guessAnswers,
          'player2.submitted': true,
        });
      }

      // Refresh snapshot
      const finalSnap = await getDoc(roomRef);
      if (finalSnap.exists()) {
        const data = finalSnap.data() as GameRoom;
        setRoomData(data);

        // Check if both already submitted
        if (data.player1?.submitted && data.player2?.submitted) {
          setStage('results');
        } else {
          setStage('waiting');
        }
      } else {
        setStage('waiting');
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
      setErrorMessage('خطا در ثبت پاسخ‌ها. لطفاً دوباره امتحان کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to landing screen with fresh room code
  const handlePlayAgain = () => {
    setStage('landing');
    setRoomCode(generateRoomCode());
    setPlayerRole(null);
    setRoomData(null);
    setSelfAnswers({});
    setErrorMessage(null);
  };

  const friendName =
    playerRole === 'player1'
      ? roomData?.player2?.name
      : roomData?.player1?.name;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FFE066] text-[#241242] font-['Vazirmatn',sans-serif] flex flex-col justify-between selection:bg-[#FF4D8D] selection:text-white relative overflow-x-hidden"
    >
      {/* Background Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      {/* Background Decorative Confetti Elements */}
      <div className="absolute top-12 right-6 w-5 h-5 bg-[#FF4D8D] border-2 border-[#241242] rounded-full rotate-12 shadow-[2px_2px_0px_0px_#241242] pointer-events-none opacity-80" />
      <div className="absolute bottom-20 left-8 w-6 h-6 bg-[#00B89C] border-2 border-[#241242] -rotate-12 shadow-[2px_2px_0px_0px_#241242] pointer-events-none opacity-80" />
      <div className="absolute top-1/3 left-6 w-3 h-8 bg-[#FF4D8D] border-2 border-[#241242] rotate-45 shadow-[2px_2px_0px_0px_#241242] pointer-events-none opacity-70" />
      <div className="absolute bottom-1/3 right-8 w-6 h-6 bg-[#00B89C] border-2 border-[#241242] rounded-md -rotate-45 shadow-[2px_2px_0px_0px_#241242] pointer-events-none opacity-70" />

      {/* Top Navbar / Brand */}
      <header className="w-full bg-[#FFFDF6] border-b-[3px] border-[#241242] py-3 px-4 shadow-[0px_4px_0px_0px_#241242] sticky top-0 z-50">
        <div className="max-w-[420px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-extrabold text-xl font-['Baloo_Bhaijaan_2',sans-serif] text-[#241242]">
              همگامی دوستان
            </span>
          </div>

          {roomCode && stage !== 'landing' && (
            <div className="bg-[#FFE066] border-2 border-[#241242] px-2.5 py-0.5 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#241242] rotate-1">
              اتاق: {roomCode}
            </div>
          )}
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col justify-center py-4 z-10">
        {stage === 'landing' && (
          <LandingScreen
            onStartGame={handleStartGame}
            isLoading={isLoading}
            errorMessage={errorMessage}
            initialCode={initialCode}
          />
        )}

        {stage === 'about_you' && (
          <QuizScreen
            round="about_you"
            playerName={playerName}
            friendName={friendName}
            onFinishRound={handleFinishSelfRound}
          />
        )}

        {stage === 'guess_time' && (
          <QuizScreen
            round="guess_time"
            playerName={playerName}
            friendName={friendName}
            onFinishRound={handleFinishGuessRound}
          />
        )}

        {stage === 'waiting' && (
          <WaitingScreen
            roomCode={roomCode}
            playerName={playerName}
            friendName={friendName}
          />
        )}

        {stage === 'results' && roomData && playerRole && (
          <ResultsScreen
            room={roomData}
            currentPlayerRole={playerRole}
            onGoToTeaser={() => setStage('teaser')}
          />
        )}

        {stage === 'teaser' && (
          <TeaserScreen onPlayAgain={handlePlayAgain} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-3 text-center text-xs font-bold text-[#241242]/70 border-t-2 border-[#241242]/20">
        مسابقه دو نفره «همگامی دوستان» — ساخته‌شده به زبان دری 🇦🇫
      </footer>
    </div>
  );
}
