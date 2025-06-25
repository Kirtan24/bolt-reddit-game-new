import React from 'react';
import { Player, GameState } from '../types/game';

interface GameHeaderProps {
  currentPlayer: Player;
  gameState: GameState;
  isAnimating: boolean;
  onRestart: () => void;
  playerColor: string;
  aiColor: string;
  playerScore: number;
  aiScore: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  gameState,
  isAnimating,
  onRestart,
  playerColor,
  aiColor,
  playerScore,
  aiScore,
}) => {
  const getStatusText = () => {
    if (gameState === 'finished') return 'Game Over!';
    if (isAnimating) return 'Chain Reaction!';
    if (currentPlayer === 'player') return 'Your Turn';
    return 'AI Thinking...';
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 w-full max-w-4xl mx-auto space-y-3">
      <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">Chain Reaction</h1>

      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full gap-3 md:gap-4">
        <div className="flex items-center justify-center space-x-4">
          {/* You Section */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all
      ${
        currentPlayer === 'player'
          ? 'border-white bg-white/20 scale-105'
          : 'border-white/30 bg-white/10'
      }`}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: playerColor }} />
            <div className="text-white font-bold flex flex-col items-start">
              <span>You</span>
              <span className="text-sm">Score: {playerScore}</span>
            </div>
          </div>

          <span className="text-white font-bold">VS</span>

          {/* AI Section */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all
      ${
        currentPlayer === 'ai'
          ? 'border-white bg-white/20 scale-105'
          : 'border-white/30 bg-white/10'
      }`}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: aiColor }} />
            <div className="text-white font-bold flex flex-col items-start">
              <span>AI</span>
              <span className="text-sm">Score: {aiScore}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center space-x-2 p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold border border-white/30 transition hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>New Game</span>
        </button>
      </div>
      <div className={`text-lg md:text-2xl font-bold text-white ${isAnimating && 'animate-pulse'}`}>
        {getStatusText()}
      </div>
    </div>
  );
};
