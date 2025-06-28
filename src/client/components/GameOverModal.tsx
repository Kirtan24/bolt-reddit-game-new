import React from 'react';
import { Player, Difficulty } from '../types/game';

interface GameOverModalProps {
  winner: Player | null;
  onRestart: () => void;
  onReturnToMenu: () => void;
  onClose: () => void;
  playerColor: string;
  aiColor: string;
  difficulty: Difficulty;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  onRestart,
  onReturnToMenu,
  onClose,
  playerColor,
  aiColor,
  difficulty,
}) => {
  const isPlayerWin = winner === 'player';
  const baseColor = isPlayerWin ? playerColor : aiColor;

  const victoryMessages = [
    'Victory!',
    'You Won!',
    'Excellent!',
    'Well Played!',
    'Outstanding!',
  ];

  const defeatMessages = [
    'Defeat!',
    'AI Wins!',
    'Try Again!',
    'So Close!',
    'Better Luck Next Time!',
  ];

  const message = isPlayerWin
    ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
    : defeatMessages[Math.floor(Math.random() * defeatMessages.length)];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-md w-full"
        style={{
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          border: `2px solid ${baseColor}`,
          boxShadow: `0px 0px 30px ${baseColor}66`,
        }}
      >
        {/* Icon */}
        <div className="text-6xl mb-4">
          {isPlayerWin ? '🏆' : '💀'}
        </div>

        {/* Main Message */}
        <h2
          className="text-3xl font-bold mb-3"
          style={{ color: baseColor }}
        >
          {message}
        </h2>

        {/* Subtext */}
        <p className="text-gray-300 text-lg mb-6">
          {isPlayerWin
            ? 'Congratulations on your victory!'
            : 'The AI wins this round!'}
        </p>

        {/* Difficulty info */}
        <div className="bg-gray-800/60 rounded-lg p-3 mb-6 w-full">
          <p className="text-sm text-gray-400 mb-1">Difficulty</p>
          <p className="font-bold text-white">{difficulty.toUpperCase()}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onRestart}
            className="font-bold rounded-lg py-3 px-6 text-white transition hover:scale-105"
            style={{
              backgroundColor: baseColor,
              boxShadow: `0px 4px 15px ${baseColor}66`,
            }}
          >
            Play Again
          </button>

          <button
            onClick={onReturnToMenu}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-3 px-6 transition hover:scale-105"
          >
            Menu
          </button>

          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg py-3 px-6 transition hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};