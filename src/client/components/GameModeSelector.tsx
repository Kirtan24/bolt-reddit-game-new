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
      icon: '😊',
      color: '#4CAF50',
      description: 'All cells explode at 4 orbs',
      features: ['🎯 Simple mechanics', '🤖 Forgiving AI', '⏱️ More thinking time'],
    },
    {
      id: 'medium' as Difficulty,
      name: 'MEDIUM',
      icon: '😐',
      color: '#FF9800',
      description: 'Variable explosion thresholds',
      features: ['🔥 Edges: 2 orbs', '⚡ Layer 2: 3 orbs', '💥 Center: 4 orbs'],
    },
    {
      id: 'hard' as Difficulty,
      name: 'HARD',
      icon: '😤',
      color: '#F44336',
      description: 'Random thresholds + obstacles',
      features: ['🚫 Random obstacles', '🎲 Random thresholds', '🧠 Expert AI'],
    },
  ];

  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let newPosition = (e.clientX - rect.left) / rect.width;

    newPosition = Math.max(0, Math.min(newPosition, 1));

    const index = Math.round(newPosition * (difficulties.length - 1));
    onDifficultyChange(difficulties[index].id);
  };

  const handleMouseUp = () => setDragging(false);

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
    '💡 Tip: Watch the threshold numbers in each cell corner!',
    '⚔️ Tip: Lower thresholds explode faster - use them strategically!',
    '🔥 Tip: Chain reactions can cascade across different thresholds!',
    '👀 Tip: In Hard mode, obstacles block explosions completely!',
    '🎯 Tip: Medium mode edges are your best starting points!',
  ];

  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 ${getBackgroundClass()} overflow-auto`}
    >
      <div className="w-full max-w-4xl space-y-4 md:space-y-8 px-4 py-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            ⚡ CHAIN REACTION ⚡
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-2">
            Choose your explosion strategy! 💥
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => onDifficultyChange(diff.id)}
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-center transition-all duration-200
                ${
                  selectedDifficulty === diff.id
                    ? 'border-white bg-white/20 scale-[1.02] shadow-2xl'
                    : 'border-gray-500 bg-gray-800/60 hover:bg-gray-700/60'
                }`}
            >
              <div className="text-4xl sm:text-5xl mb-3">{diff.icon}</div>
              <h3
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: diff.color }}
              >
                {diff.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mb-4">{diff.description}</p>
              
              {/* Features List */}
              <div className="space-y-1">
                {diff.features.map((feature, index) => (
                  <p key={index} className="text-xs text-gray-400">
                    {feature}
                  </p>
                ))}
              </div>

              {selectedDifficulty === diff.id && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Threshold Visualization */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-3 text-center">
            🎯 Explosion Pattern Preview
          </h3>
          <div className="grid grid-cols-5 gap-1 max-w-xs mx-auto">
            {Array.from({ length: 25 }, (_, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              let threshold = 4;
              let bgColor = 'bg-red-500/30';

              if (selectedDifficulty === 'medium') {
                if (row === 0 || row === 4 || col === 0 || col === 4) {
                  threshold = 2;
                  bgColor = 'bg-green-500/30';
                } else if (row === 1 || row === 3 || col === 1 || col === 3) {
                  threshold = 3;
                  bgColor = 'bg-yellow-500/30';
                }
              } else if (selectedDifficulty === 'hard') {
                const random = (row * 5 + col) % 3;
                threshold = random === 0 ? 2 : random === 1 ? 3 : 4;
                bgColor = threshold === 2 ? 'bg-green-500/30' : threshold === 3 ? 'bg-yellow-500/30' : 'bg-red-500/30';
              }

              return (
                <div
                  key={i}
                  className={`aspect-square rounded border border-white/20 ${bgColor} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {threshold}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center space-x-4 mt-3 text-xs">
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500/50 rounded"></div>
              <span className="text-green-400">2 orbs</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500/50 rounded"></div>
              <span className="text-yellow-400">3 orbs</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500/50 rounded"></div>
              <span className="text-red-400">4 orbs</span>
            </span>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mt-6">
          <button
            onClick={onStartGame}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg sm:text-xl md:text-2xl px-8 py-3 sm:px-12 sm:py-4 rounded-xl md:rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl"
          >
            🚀 START BATTLE 🚀
          </button>
          <p className="text-xs sm:text-sm text-gray-400 mt-3">
            Selected Mode:{' '}
            <span className="text-white font-bold">{selectedDifficulty.toUpperCase()}</span>
          </p>
        </div>

        {/* Tip */}
        <div className="text-center text-xs sm:text-sm text-gray-500">{randomTip}</div>
      </div>
    </div>
  );
};