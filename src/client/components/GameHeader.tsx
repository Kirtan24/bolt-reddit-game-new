import React from 'react';
import { Player, GameState } from '../types/game';

interface GameHeaderProps {
  currentPlayer: Player;
  gameState: GameState;
  isAnimating: boolean;
  onRestart: () => void;
  playerColor: string;
  aiColor: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  gameState,
  isAnimating,
  onRestart,
  playerColor,
  aiColor,
}) => {
  const getStatusText = () => {
    if (gameState === 'finished') return 'Game Over!';
    if (isAnimating) return 'Chain Reaction!';
    if (currentPlayer === 'player') return 'Your Turn';
    return 'AI Thinking...';
  };

  // Get solid colors
  const getPlayerColors = () => {
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      green: '#22c55e',
      purple: '#a855f7',
      pink: '#ec4899',
      red: '#ef4444',
      orange: '#f97316',
      yellow: '#eab308',
    };

    return {
      player: colorMap[playerColor] || colorMap.blue,
      ai: colorMap[aiColor] || colorMap.red,
    };
  };

  const colors = getPlayerColors();

  return (
    <div className="py-4 px-6 text-center w-full">
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Chain Reaction</h1>

      <div className="flex items-center justify-between mb-4 max-w-4xl mx-auto">
        <div className="flex items-center space-x-8">
          {/* Player indicator */}
          <div
            className={`
              flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 transform border-2
              ${currentPlayer === 'player' ? 'scale-110 shadow-lg' : ''}
            `}
            style={{
              borderColor: currentPlayer === 'player' ? 'white' : 'rgba(255, 255, 255, 0.3)',
              backgroundColor:
                currentPlayer === 'player'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full shadow-md"
              style={{ backgroundColor: colors.player }}
            />
            <span className="text-white font-bold text-lg">You</span>
          </div>

          {/* VS */}
          <span className="text-white/80 font-bold text-2xl">VS</span>

          {/* AI indicator */}
          <div
            className={`
              flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 transform border-2
              ${currentPlayer === 'ai' ? 'scale-110 shadow-lg' : ''}
            `}
            style={{
              borderColor: currentPlayer === 'ai' ? 'white' : 'rgba(255, 255, 255, 0.3)',
              backgroundColor:
                currentPlayer === 'ai' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full shadow-md"
              style={{ backgroundColor: colors.ai }}
            />
            <span className="text-white font-bold text-lg">AI</span>
          </div>
        </div>

        {/* Restart button with icon */}
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border border-white/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-lg">New Game</span>
        </button>
      </div>

      <div className={`text-2xl font-bold text-white ${isAnimating ? 'animate-pulse' : ''}`}>
        {getStatusText()}
      </div>

      {/* Game rules
      <div className="text-sm text-white/90 max-w-2xl mx-auto bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
        <p className="font-semibold mb-1">How to Play:</p>
        <p>
          Place your first orb anywhere, then only expand your own cells. All cells explode at 4
          orbs!
        </p>
      </div> */}
    </div>
  );
};
