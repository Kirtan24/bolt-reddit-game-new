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
      name: 'BABY MODE',
      icon: '🍼',
      color: '#22c55e',
      description: 'For couch potatoes & your grandma 👵',
      subtitle: 'AI has the IQ of a goldfish',
    },
    {
      id: 'medium' as Difficulty,
      name: 'NORMAL HUMAN',
      icon: '🧠',
      color: '#f59e0b',
      description: 'For average mortals & office workers 💼',
      subtitle: 'AI is mildly competent',
    },
    {
      id: 'hard' as Difficulty,
      name: 'CHAOS LORD',
      icon: '👹',
      color: '#ef4444',
      description: 'For masochists & keyboard warriors ⌨️',
      subtitle: 'AI will destroy your soul',
    },
  ];

  const sillyTips = [
    '💡 Pro Tip: Corners are safe... but boring AF! 😴',
    '⚔️ Chaos Tip: Rush the center like a maniac! 🏃‍♂️',
    '🔥 Explosion Tip: Chain reactions = pure dopamine! 💉',
    '👀 Spy Tip: Watch the AI... it\'s plotting your doom! 🕵️',
    '🎯 Strategy Tip: Sometimes defense > offense (shocking!) 🛡️',
    '🤯 Mind Tip: Think 3 moves ahead or cry later! 😭',
    '🎪 Circus Tip: Embrace the chaos, become the chaos! 🎭',
    '🧙‍♂️ Wizard Tip: Magic happens when you least expect it! ✨',
  ];

  const [randomTip, setRandomTip] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sillyTips.length);
    setRandomTip(sillyTips[randomIndex]);
  }, []);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    onDifficultyChange(difficulty);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-purple-900 to-gray-800 overflow-auto">
      {/* Floating silly elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`
            }}
          >
            {['💥', '⚡', '🔥', '🎮', '🤖', '👾', '🎯', '💀'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="w-full max-w-4xl space-y-6 p-6 rounded-3xl backdrop-blur-sm bg-black/30 border border-white/20">
        {/* Epic Header */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-2xl mb-2">
            ⚡ CHOOSE YOUR DOOM ⚡
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 font-bold">
            🎪 Pick your level of suffering & chaos! 🎪
          </p>
          <div className="text-sm text-yellow-400 mt-2 animate-pulse">
            🏆 Silly Sh!t Challenge • Reddit x Bolt Hackathon 🏆
          </div>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              onClick={() => handleDifficultySelect(diff.id)}
              className={`
                relative p-6 rounded-2xl border-3 cursor-pointer
                transition-all transform duration-300
                ${selectedDifficulty === diff.id 
                  ? 'scale-105 shadow-2xl rotate-1' 
                  : 'hover:scale-102 hover:-rotate-1'
                }
                ${isShaking && selectedDifficulty === diff.id ? 'animate-shake' : ''}
              `}
              style={{
                borderColor: diff.color,
                background: `linear-gradient(135deg, ${diff.color}22, ${diff.color}11)`,
                boxShadow: selectedDifficulty === diff.id 
                  ? `0 0 30px ${diff.color}88` 
                  : `0 10px 25px ${diff.color}33`,
              }}
            >
              {/* Icon */}
              <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: `${Math.random()}s` }}>
                {diff.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-black mb-2" style={{ color: diff.color }}>
                {diff.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-100 mb-2 font-semibold">
                {diff.description}
              </p>
              
              {/* Subtitle */}
              <p className="text-xs text-gray-400 italic">
                {diff.subtitle}
              </p>

              {/* Selection indicator */}
              {selectedDifficulty === diff.id && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-black text-lg animate-spin">
                  ⚡
                </div>
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300" 
                   style={{ background: diff.color }} />
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center mt-8">
          <button
            onClick={onStartGame}
            className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 hover:from-yellow-600 hover:via-red-600 hover:to-pink-600 text-gray-900 font-black text-2xl sm:text-3xl rounded-2xl px-12 py-4 shadow-2xl hover:scale-110 hover:rotate-2 active:scale-95 transition-all duration-300"
            style={{
              boxShadow: '0 0 40px rgba(255, 255, 0, 0.6), 0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            🚀 UNLEASH THE CHAOS 🚀
          </button>
          <p className="text-sm text-gray-400 mt-3 font-semibold">
            Selected Doom Level:{' '}
            <span className="font-black text-yellow-400 text-lg">
              {difficulties.find(d => d.id === selectedDifficulty)?.name}
            </span>
          </p>
        </div>

        {/* Silly Tip */}
        <div className="text-center text-gray-300 text-sm sm:text-base mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/30">
          <div className="animate-pulse font-bold">
            {randomTip}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="text-center text-xs text-gray-500 space-y-1 mt-4">
          <p>🎮 Built with maximum silliness for Reddit's hackathon</p>
          <p>⚡ Powered by Bolt x Devvit • Made with 🧠 and ☕</p>
        </div>
      </div>
    </div>
  );
};