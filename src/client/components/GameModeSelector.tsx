import React, { useState, useRef, useEffect } from 'react';
import { Difficulty } from '../types/game';

interface GameModeSelectorProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  onStartGame,
}) => {
  const difficulties = [
    {
      id: 'easy' as Difficulty,
      name: 'EASY',
      icon: '🌱',
      color: '#22c55e',
      description: 'For rookies & couch potatoes 🥔',
    },
    {
      id: 'medium' as Difficulty,
      name: 'MEDIUM',
      icon: '🔥',
      color: '#f59e0b',
      description: 'For the average gamer 💥',
    },
    {
      id: 'hard' as Difficulty,
      name: 'HARD',
      icon: '💀',
      color: '#ef4444',
      description: 'For sweat lords & maniacs 👑',
    },
  ];

  const tips = [
    '💡 Tip: Corner spots = safe, but boring… try riskier plays!',
    '⚔️ Tip: Claim smaller spots quickly for early dominance!',
    '🔥 Tip: Chain reactions can wipe out enemies… BOOM! 💥',
    '👀 Tip: Watch your opponent closely, adapt your moves!',
    '🎯 Tip: Sometimes defending beats attacking. Stay sharp!',
  ];

  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-auto">
      <div className="w-full max-w-3xl space-y-4 md:space-y-6 p-4 rounded-3xl backdrop-blur-sm">
        {/* Main Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 drop-shadow-[0px_0px_12px_#facc15]">
            ⚡ CHAIN REACTION ⚡
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-2">
            Pick your difficulty & unleash total chaos! 👊
          </p>
        </div>

        {/* Difficulty Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              onClick={() => onDifficultyChange(diff.id)}
              className={`
        relative p-6 rounded-2xl border-2 cursor-pointer
        transition-all transform
        ${selectedDifficulty === diff.id ? 'scale-105 shadow-[0px_0px_15px_#facc15]' : 'hover:scale-102'}
      `}
              style={{
                borderColor: diff.color,
                background: `${diff.color}22`,
              }}
            >
              <div className="text-5xl">{diff.icon}</div>
              <h3 className="text-2xl font-bold mt-3" style={{ color: diff.color }}>
                {diff.name}
              </h3>
              <p className="text-sm text-gray-100 mt-1">{diff.description}</p>
              {selectedDifficulty === diff.id && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full w-7 h-7 flex items-center justify-center font-bold">
                  ✅
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center mt-6">
          <button
            onClick={onStartGame}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-gray-900 font-bold text-xl sm:text-2xl rounded-xl px-8 py-3 sm:px-10 sm:py-4 shadow-[0px_0px_12px_#facc15] hover:scale-105 active:scale-95 transition"
          >
            🚀 START BATTLE 🚀
          </button>
          <p className="text-sm text-gray-400 mt-3">
            Difficulty:{' '}
            <span className="font-bold text-yellow-400">{selectedDifficulty.toUpperCase()}</span>
          </p>
        </div>

        {/* Tip */}
        <div className="text-center text-gray-300 text-sm sm:text-base mt-4 p-3 rounded-xl bg-gray-800/60">
          💡 {randomTip}
        </div>
      </div>
    </div>
  );
};
