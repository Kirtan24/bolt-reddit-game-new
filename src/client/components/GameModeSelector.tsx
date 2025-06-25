import React from 'react';
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
      bgColor: 'bg-green-500',
      description: 'Perfect for beginners',
      features: ['Slower AI', 'More thinking time', 'Forgiving gameplay'],
    },
    {
      id: 'medium' as Difficulty,
      name: 'MEDIUM',
      icon: '😐',
      color: '#FF9800',
      bgColor: 'bg-orange-500',
      description: 'Balanced challenge',
      features: ['Smart AI', 'Standard gameplay', 'Fair competition'],
    },
    {
      id: 'hard' as Difficulty,
      name: 'HARD',
      icon: '😤',
      color: '#F44336',
      bgColor: 'bg-red-500',
      description: 'Ultimate challenge',
      features: ['Expert AI', 'Random obstacles', 'Maximum difficulty'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            ⚡ CHAIN REACTION ⚡
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">Strategic Orb Warfare</p>
          <p className="text-lg text-gray-400">Choose your battle difficulty</p>
        </div>

        {/* Game Info Section */}
        <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🎯 HOW TO PLAY</h2>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="text-white font-bold mb-2">Place Orbs</h3>
              <p className="text-gray-300 text-sm">Click cells to add orbs strategically</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2">💥</div>
              <h3 className="text-white font-bold mb-2">Chain Reactions</h3>
              <p className="text-gray-300 text-sm">Trigger explosive chain reactions</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-white font-bold mb-2">Dominate</h3>
              <p className="text-gray-300 text-sm">Eliminate all enemy orbs to win</p>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Select Difficulty</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => onDifficultyChange(diff.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                  ${
                    selectedDifficulty === diff.id
                      ? 'border-white bg-white/20 scale-105'
                      : 'border-white/30 bg-white/10 hover:bg-white/15'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{diff.icon}</div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: diff.color }}
                  >
                    {diff.name}
                  </h3>
                  <p className="text-gray-300 mb-4">{diff.description}</p>
                  <div className="space-y-2">
                    {diff.features.map((feature, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-400 bg-black/30 rounded-lg px-3 py-1"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                {selectedDifficulty === diff.id && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Slider Visual */}
        <div className="mb-8">
          <div className="bg-black/30 rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-center mb-4">Difficulty Level</h3>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400 font-bold">EASY</span>
                <span className="text-orange-400 font-bold">MEDIUM</span>
                <span className="text-red-400 font-bold">HARD</span>
              </div>
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    selectedDifficulty === 'easy'
                      ? 'w-1/3 bg-green-500'
                      : selectedDifficulty === 'medium'
                      ? 'w-2/3 bg-orange-500'
                      : 'w-full bg-red-500'
                  }`}
                />
                <div
                  className={`absolute top-0 h-full w-6 bg-white rounded-full border-2 border-gray-300 transition-all duration-500 ${
                    selectedDifficulty === 'easy'
                      ? 'left-[calc(33.33%-12px)]'
                      : selectedDifficulty === 'medium'
                      ? 'left-[calc(66.66%-12px)]'
                      : 'left-[calc(100%-24px)]'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={onStartGame}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-2xl px-12 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            🚀 START BATTLE 🚀
          </button>
          <p className="text-gray-400 mt-4">
            Selected: <span className="text-white font-bold">{selectedDifficulty.toUpperCase()}</span> Mode
          </p>
        </div>

        {/* Bottom Tips */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            💡 Tip: Corner cells are safer but harder to expand from!
          </p>
        </div>
      </div>
    </div>
  );
};