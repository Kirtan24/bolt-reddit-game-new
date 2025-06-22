import React from 'react';
import { Player } from '../types/game';

interface GameOverModalProps {
  winner: Player | null;
  onRestart: () => void;
  onClose: () => void;
  playerColor: string;
  aiColor: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  onRestart,
  onClose,
  playerColor,
  aiColor,
}) => {
  const isPlayerWin = winner === 'player';
  const baseColor = isPlayerWin ? playerColor : aiColor;

  const victoryMessages = [
    'Victory! 🎉',
    'Well Done! 👏',
    'Excellent! 🌟',
    'Amazing! 🚀',
    'Perfect! 🏆',
  ];
  const defeatMessages = [
    'AI Wins! 🤖',
    'Try Again! 🔥',
    'So Close! 😅',
    'Next Time! 🙌',
    'Better Luck! 🍀',
  ];
  const message = isPlayerWin
    ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
    : defeatMessages[Math.floor(Math.random() * defeatMessages.length)];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-3xl p-10 shadow-2xl max-w-lg w-full relative flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: `2px solid ${baseColor}`,
          boxShadow: `0px 0px 30px ${baseColor}55`,
        }}
      >
        {/* Winner Icon */}
        <div
          className={`text-9xl ${isPlayerWin ? 'text-yellow-400' : 'text-gray-300'} animate-bounce-slow drop-shadow-[0_0_20px_${baseColor}]`}
        >
          {isPlayerWin ? '🎉' : '🤖'}
        </div>

        {/* Main Message */}
        <h2
          className="text-5xl font-extrabold mt-4"
          style={{ color: baseColor, textShadow: `0px 0px 12px ${baseColor}99` }}
        >
          {message}
        </h2>

        {/* Subtext */}
        <p className="text-gray-100 text-xl font-medium mt-3">
          {isPlayerWin
            ? 'You triggered the ultimate chain reaction! 💥'
            : 'The AI conquered this round. Try again for glory! 💪'}
        </p>

        {/* Buttons */}
        <div className="flex space-x-4 justify-center mt-8">
          <button
            onClick={onRestart}
            className="font-bold py-3 px-6 rounded-2xl text-xl text-white transition transform hover:scale-105"
            style={{
              backgroundColor: baseColor,
              boxShadow: `0px 4px 12px ${baseColor}99`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0px 6px 20px ${baseColor}dd`)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0px 4px 12px ${baseColor}99`)}
          >
            Play Again
          </button>

          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl text-xl transition transform hover:scale-105 backdrop-blur-sm border border-white/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
