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
    '💥 You Nuked It!',
    '🌟 Legend Unlocked!',
    '🏆 Pure Domination!',
    '🔥 Totally Annihilated!',
    '🥳 Chain Reaction Master!',
  ];
  const defeatMessages = [
    '🤯 AI Got You This Time!',
    '😅 So Close, Yet So Far!',
    '🍀 Try The Luck Orb Next Time!',
    '👻 The AI Haunts You!',
    '☠️ Defeat Never Looked So Good!',
  ];

  const message = isPlayerWin
    ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
    : defeatMessages[Math.floor(Math.random() * defeatMessages.length)];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-auto">
      <div
        className="rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center relative max-w-full w-full sm:max-w-md"
        style={{
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          border: `3px solid ${baseColor}`,
          boxShadow: `0px 0px 40px ${baseColor}99`,
        }}
      >
        {/* Gem/Epic Icon */}
        <div
          className={`text-7xl md:text-9xl animate-[pulse_1.2s_infinite] drop-shadow-[0_0_25px_${baseColor}]`}
        >
          {isPlayerWin ? '👑' : '👻'}
        </div>

        {/* Main Message */}
        <h2
          className="text-3xl md:text-5xl font-extrabold mt-4"
          style={{
            color: baseColor,
            textShadow: `0px 0px 12px ${baseColor}aa`,
          }}
        >
          {message}
        </h2>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl font-medium mt-3">
          {isPlayerWin
            ? '✨ The Chain Reaction Titan emerges victorious!'
            : '💔 The AI wins... but you can try again!'}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4 w-full">
          <button
            onClick={onRestart}
            className="font-bold rounded-xl py-3 px-6 text-lg md:text-xl text-white transition transform hover:scale-105 hover:rotate-1"
            style={{
              background: `linear-gradient(45deg, ${baseColor}, ${baseColor}99)`,
              boxShadow: `0px 4px 15px ${baseColor}aa`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0px 6px 25px ${baseColor}dd`)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0px 4px 15px ${baseColor}aa`)}
          >
            🔁 Play Again
          </button>

          <button
            onClick={onClose}
            className="bg-gray-700/30 hover:bg-gray-600/40 text-gray-100 font-bold rounded-xl py-3 px-6 text-lg md:text-xl transition transform hover:scale-105 hover:-rotate-1 backdrop-blur-sm border border-gray-500"
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};
