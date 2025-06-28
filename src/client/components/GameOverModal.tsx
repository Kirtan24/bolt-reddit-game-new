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
    '💀 Death Dealer Supreme! 💀',
    '⛓️ Chain Master Victorious! ⛓️',
    '🏆 Spread Champion! 🏆',
    '💥 Explosion Expert! 💥',
    '👑 Orb Overlord! 👑',
    '🔥 Chaos Controller! 🔥',
    '⚡ Reaction Ruler! ⚡',
    '💀 Spread \'Til Victory! 💀',
  ];

  const defeatMessages = [
    '💀 Spread \'Til Dead! 💀',
    '⛓️ Chained by AI! ⛓️',
    '🤖 Robot Rampage! 🤖',
    '💥 AI Annihilation! 💥',
    '😵 Orb Obliterated! 😵',
    '🔥 Burned by Bots! 🔥',
    '⚡ Zapped by AI! ⚡',
    '💀 Death by Algorithm! 💀',
  ];

  const sillySubtexts = [
    'The orbs have spoken!',
    'Chain reactions don\'t lie!',
    'Spread the word... or spread \'til dead!',
    'Another victim of the chaos!',
    'The algorithm of destruction!',
    'Orb warfare at its finest!',
    'Strategic mayhem achieved!',
    'Death by a thousand explosions!',
  ];

  const message = isPlayerWin
    ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
    : defeatMessages[Math.floor(Math.random() * defeatMessages.length)];

  const subtext = sillySubtexts[Math.floor(Math.random() * sillySubtexts.length)];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-md w-full relative overflow-hidden"
        style={{
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          border: `3px solid ${baseColor}`,
          boxShadow: `0px 0px 40px ${baseColor}66`,
        }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute text-lg opacity-10 animate-pulse"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${10 + (i * 15)}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            >
              {i % 3 === 0 ? '💀' : i % 3 === 1 ? '⛓️' : '💥'}
            </div>
          ))}
        </div>

        {/* Main icon with animation */}
        <div className="relative z-10 mb-6">
          <div className={`text-8xl ${isPlayerWin ? 'animate-bounce' : 'animate-pulse'}`}>
            {isPlayerWin ? '👑' : '💀'}
          </div>
        </div>

        {/* Main message */}
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10"
          style={{
            color: baseColor,
            textShadow: `0px 0px 15px ${baseColor}aa`,
          }}
        >
          {message}
        </h2>

        {/* Silly subtext */}
        <p className="text-gray-300 text-lg font-medium mb-4 relative z-10">
          {subtext}
        </p>

        {/* Difficulty and stats */}
        <div className="bg-gray-800/80 rounded-xl p-4 mb-6 w-full relative z-10 border border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Difficulty:</span>
            <span className="font-bold text-white">{difficulty.toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Result:</span>
            <span className="font-bold" style={{ color: baseColor }}>
              {isPlayerWin ? 'VICTORY' : 'DEFEAT'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10">
          <button
            onClick={onRestart}
            className="font-bold rounded-xl py-3 px-6 text-white transition transform hover:scale-105 flex-1"
            style={{
              background: `linear-gradient(45deg, ${baseColor}, ${baseColor}dd)`,
              boxShadow: `0px 4px 20px ${baseColor}66`,
            }}
          >
            💀 Spread Again 💀
          </button>

          <button
            onClick={onReturnToMenu}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl py-3 px-6 transition transform hover:scale-105 flex-1"
          >
            🏠 Menu
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-3 bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 font-bold rounded-lg py-2 px-4 text-sm transition transform hover:scale-105 relative z-10"
        >
          ✕ Close
        </button>

        {/* Bottom slogan */}
        <div className="mt-4 text-xs text-yellow-400/80 relative z-10">
          ⛓️ Chain it. Break it. Rule it. ⛓️
        </div>
      </div>
    </div>
  );
};