import React, { useState, useEffect } from 'react';
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
      icon: '😊',
      color: '#4CAF50',
      description: 'Perfect for newcomers',
    },
    {
      id: 'medium' as Difficulty,
      name: 'MEDIUM',
      icon: '😐',
      color: '#FF9800',
      description: 'A balanced challenge',
    },
    {
      id: 'hard' as Difficulty,
      name: 'HARD',
      icon: '😤',
      color: '#F44336',
      description: 'For seasoned pros',
    },
  ];

  const getBackgroundClass = () => {
    switch (selectedDifficulty) {
      case 'easy':
        return 'bg-[radial-gradient(ellipse_at_center,_#4CAF50_0%,_#1B5E20_100%)]';
      case 'medium':
        return 'bg-[radial-gradient(ellipse_at_center,_#FF9800_0%,_#F57C00_100%)]';
      case 'hard':
        return 'bg-[radial-gradient(ellipse_at_center,_#F44336_0%,_#B71C1C_100%)]';
      default:
        return 'bg-[radial-gradient(ellipse_at_center,_#1e293b_0%,_#4c1d95_100%)]';
    }
  };

  const tips = [
    '💡 Tip: Corner spots are safe but harder to expand from... use wisely!',
    '⚔️ Tip: Focus on claiming smaller spots first to gain area quickly!',
    '🔥 Tip: Chain reactions can wipe out enemy spots — time them well!',
    '👀 Tip: Watch your opponent closely and adapt your moves accordingly!',
    "🎯 Tip: Sometimes it's better to defend than to attack!",
  ];

  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 ${getBackgroundClass()} overflow-auto`}
    >
      <div className="w-full max-w-3xl space-y-4 md:space-y-8 px-4 py-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            ⚡ CHAIN REACTION ⚡
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-2">
            Choose your difficulty, then blast away! 💥
          </p>
        </div>

        {/* Difficulty Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => onDifficultyChange(diff.id)}
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-center transition-all duration-200
                ${
                  selectedDifficulty === diff.id
                    ? 'border-white bg-white/20 scale-[1.02]'
                    : 'border-gray-500 bg-gray-800 hover:bg-gray-700'
                }`}
            >
              <div className="text-4xl sm:text-5xl">{diff.icon}</div>
              <h3
                className="text-xl sm:text-2xl font-bold mt-2 sm:mt-3"
                style={{ color: diff.color }}
              >
                {diff.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">{diff.description}</p>
              {selectedDifficulty === diff.id && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center font-bold text-xs sm:text-sm">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center mt-4 sm:mt-6">
          <button
            onClick={onStartGame}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg sm:text-xl md:text-2xl px-6 py-2 sm:px-8 sm:py-3 md:px-12 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🚀 START BATTLE 🚀
          </button>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3">
            Selected Difficulty:{' '}
            <span className="text-white font-bold">{selectedDifficulty.toUpperCase()}</span>
          </p>
        </div>

        {/* Tip */}
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">{randomTip}</div>
      </div>
    </div>
  );
};