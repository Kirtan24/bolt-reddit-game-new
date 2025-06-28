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
    '💥 You Absolutely NUKED It!',
    '🌟 LEGENDARY Status Unlocked!',
    '🏆 Total World Domination!',
    '🔥 Completely ANNIHILATED!',
    '🥳 Chain Reaction MASTER!',
    '👑 Bow Down to the ORB KING!',
    '⚡ MAXIMUM CHAOS ACHIEVED!',
  ];

  const defeatMessages = [
    '🤯 AI Totally REKT You!',
    '😅 So Close, Yet So DOOMED!',
    '🍀 Maybe Try Baby Mode Next Time!',
    '👻 The AI Haunts Your Dreams!',
    '☠️ Defeat Never Looked So EPIC!',
    '🤖 RESISTANCE IS FUTILE!',
    '💀 GET GOOD, HUMAN!',
  ];

  const getDifficultyTaunt = () => {
    switch (difficulty) {
      case 'easy':
        return isPlayerWin 
          ? '🍼 Even babies can win sometimes!' 
          : '🍼 Lost to baby mode? Really?!';
      case 'medium':
        return isPlayerWin 
          ? '🧠 Average human intelligence confirmed!' 
          : '🧠 Below average human detected!';
      case 'hard':
        return isPlayerWin 
          ? '👹 CHAOS LORD STATUS ACHIEVED!' 
          : '👹 The chaos consumed your soul!';
      default:
        return '';
    }
  };

  const message = isPlayerWin
    ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
    : defeatMessages[Math.floor(Math.random() * defeatMessages.length)];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-auto">
      <div
        className="rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center relative max-w-full w-full sm:max-w-lg"
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: `4px solid ${baseColor}`,
          boxShadow: `0px 0px 60px ${baseColor}aa, inset 0px 0px 30px ${baseColor}22`,
        }}
      >
        {/* Epic Icon with Animation */}
        <div className="relative mb-6">
          <div
            className={`text-8xl md:text-9xl animate-bounce drop-shadow-2xl`}
            style={{
              filter: `drop-shadow(0 0 20px ${baseColor})`,
              animationDuration: '1s'
            }}
          >
            {isPlayerWin ? '👑' : '💀'}
          </div>
          {/* Explosion effect */}
          <div className="absolute inset-0 text-6xl md:text-7xl animate-ping opacity-50">
            💥
          </div>
        </div>

        {/* Main Message */}
        <h2
          className="text-3xl md:text-5xl font-black mb-4 animate-pulse"
          style={{
            color: baseColor,
            textShadow: `0px 0px 20px ${baseColor}dd, 0px 0px 40px ${baseColor}88`,
          }}
        >
          {message}
        </h2>

        {/* Difficulty Taunt */}
        <p className="text-yellow-400 text-lg md:text-xl font-bold mb-3 animate-bounce">
          {getDifficultyTaunt()}
        </p>

        {/* Subtext */}
        <p className="text-gray-300 text-lg md:text-xl font-semibold mb-6 max-w-md">
          {isPlayerWin
            ? '✨ The Chain Reaction Titan emerges victorious from the chaos!'
            : '💔 The AI wins... but your suffering was GLORIOUS!'}
        </p>

        {/* Silly Stats */}
        <div className="bg-gray-800/60 rounded-xl p-4 mb-6 border border-gray-600">
          <p className="text-sm text-gray-400 mb-2">🎪 SILLY SH!T CHALLENGE STATS 🎪</p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-yellow-400">Chaos Level:</span>
              <br />
              <span className="font-bold">MAXIMUM</span>
            </div>
            <div>
              <span className="text-yellow-400">Fun Factor:</span>
              <br />
              <span className="font-bold">OVER 9000</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <button
            onClick={onRestart}
            className="font-black rounded-xl py-4 px-8 text-lg md:text-xl text-white transition transform hover:scale-110 hover:rotate-2 active:scale-95"
            style={{
              background: `linear-gradient(45deg, ${baseColor}, ${baseColor}cc)`,
              boxShadow: `0px 6px 20px ${baseColor}aa`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0px 8px 30px ${baseColor}dd`;
              e.currentTarget.style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0px 6px 20px ${baseColor}aa`;
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            🔁 REMATCH TIME!
          </button>

          <button
            onClick={onReturnToMenu}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black rounded-xl py-4 px-8 text-lg md:text-xl transition transform hover:scale-110 hover:-rotate-2 active:scale-95 shadow-xl"
          >
            🏠 ESCAPE TO MENU
          </button>

          <button
            onClick={onClose}
            className="bg-gray-700/50 hover:bg-gray-600/60 text-gray-100 font-bold rounded-xl py-4 px-8 text-lg md:text-xl transition transform hover:scale-105 backdrop-blur-sm border border-gray-500"
          >
            ❌ CLOSE
          </button>
        </div>

        {/* Bottom silly text */}
        <div className="mt-6 text-xs text-gray-500 italic">
          🎮 Built for Reddit's Silly Sh!t Challenge • Maximum chaos achieved! 🎮
        </div>
      </div>
    </div>
  );
};