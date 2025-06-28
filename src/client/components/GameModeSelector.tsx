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
      icon: '🌱',
      color: '#22c55e',
      description: 'For beginners and casual players',
    },
    {
      id: 'medium' as Difficulty,
      name: 'MEDIUM',
      icon: '🔥',
      color: '#f59e0b',
      description: 'For experienced players',
    },
    {
      id: 'hard' as Difficulty,
      name: 'HARD',
      icon: '💀',
      color: '#ef4444',
      description: 'For expert players',
    },
  ];

  const tips = [
    '💡 Tip: Corner cells are safer but have fewer neighbors',
    '⚔️ Tip: Control the center for strategic advantage',
    '🔥 Tip: Chain reactions can turn the tide instantly',
    '👀 Tip: Watch your opponent\'s critical mass cells',
    '🎯 Tip: Sometimes defense is better than offense',
  ];

  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-auto">
      <div className="w-full max-w-3xl space-y-6 p-6 rounded-2xl backdrop-blur-sm bg-black/20 border border-white/10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            ⚡ Chain Reaction
          </h1>
          <p className="text-lg text-gray-300">
            Choose your difficulty level
          </p>
        </div>

        {/* Difficulty Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              onClick={() => onDifficultyChange(diff.id)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer
                transition-all transform duration-200
                ${selectedDifficulty === diff.id ? 'scale-105 shadow-lg' : 'hover:scale-102'}
              `}
              style={{
                borderColor: diff.color,
                background: `${diff.color}15`,
              }}
            >
              <div className="text-4xl mb-3">{diff.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: diff.color }}>
                {diff.name}
              </h3>
              <p className="text-sm text-gray-300">{diff.description}</p>
              {selectedDifficulty === diff.id && (
                <div className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={onStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-10 py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Start Game
          </button>
          <p className="text-sm text-gray-400 mt-3">
            Difficulty: <span className="font-semibold text-white">{selectedDifficulty.toUpperCase()}</span>
          </p>
        </div>

        {/* Tip */}
        <div className="text-center text-gray-300 text-sm p-3 rounded-lg bg-gray-800/40 border border-gray-700">
          {randomTip}
        </div>
      </div>
    </div>
  );
};