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
    'Death Dealer Supreme!',
    'Chain Master Victorious!',
    'Spread Champion!',
    'Explosion Expert!',
    'Orb Overlord!',
    'Chaos Controller!',
    'Reaction Ruler!',
    'Spread \'Til Victory!',
  ];

  const defeatMessages = [
    'Spread \'Til Dead!',
    'Chained by AI!',
    'Robot Rampage!',
    'AI Annihilation!',
    'Orb Obliterated!',
    'Burned by Bots!',
    'Zapped by AI!',
    'Death by Algorithm!',
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
        className="relative rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-md w-full overflow-hidden"
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.95)',
          border: `3px solid ${baseColor}`,
          boxShadow: `0 0 30px ${baseColor}55`,
        }}
      >
        {/* Animated diagonal emojis */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(12)].map((_, i) => {
            const icons = ['💀', '⛓️', '💥'];
            const icon = icons[i % icons.length];
            return (
              <div
                key={i}
                className="absolute text-lg opacity-10 animate-pulse"
                style={{
                  top: `${(i * 10 + 15) % 100}vh`,
                  left: `${(i * 13 + 10) % 100}vw`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${3 + (i % 3)}s`,
                }}
              >
                {icon}
              </div>
            );
          })}
        </div>

        {/* Main Icon */}
        <div className="relative z-10 mb-6 text-7xl sm:text-8xl">
          <span className={isPlayerWin ? 'animate-bounce' : 'animate-pulse'}>
            {isPlayerWin ? '👑' : '💀'}
          </span>
        </div>

        {/* Victory / Defeat */}
        <h2
          className="text-3xl md:text-4xl font-extrabold mb-2 z-10"
          style={{
            color: baseColor,
            textShadow: `0 0 15px ${baseColor}aa`,
          }}
        >
          {message}
        </h2>

        {/* Subtext */}
        <p className="text-gray-300 text-lg font-medium mb-4 z-10">{subtext}</p>

        {/* Game Info */}
        <div className="bg-gray-800/80 rounded-xl border border-gray-600 p-4 mb-6 w-full z-10">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Difficulty:</span>
            <span className="font-bold text-white">{difficulty.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Result:</span>
            <span className="font-bold" style={{ color: baseColor }}>
              {isPlayerWin ? 'VICTORY' : 'DEFEAT'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full z-10">
          <button
            onClick={onRestart}
            className="font-bold rounded-xl py-3 px-6 text-white flex-1 transition hover:scale-105"
            style={{
              background: `linear-gradient(45deg, ${baseColor}, ${baseColor}dd)`,
              boxShadow: `0 4px 20px ${baseColor}66`,
            }}
          >
            Spread Again
          </button>

          <button
            onClick={onReturnToMenu}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl py-3 px-6 flex-1 transition hover:scale-105"
          >
            Menu
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-4 text-sm font-bold text-gray-300 bg-gray-700/50 hover:bg-gray-600/60 rounded-lg px-4 py-2 z-10 transition hover:scale-105"
        >
          Close
        </button>

        {/* Footer Slogan */}
        <div className="mt-3 text-xs text-yellow-400/80 z-10">
          Chain it. Break it. Rule it.
        </div>
      </div>
    </div>
  );
};
