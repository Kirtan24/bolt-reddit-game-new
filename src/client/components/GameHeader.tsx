import React from 'react';
import { Player, GameState, Difficulty } from '../types/game';

interface GameHeaderProps {
  currentPlayer: Player;
  gameState: GameState;
  isAnimating: boolean;
  onRestart: () => void;
  onReturnToMenu: () => void;
  playerColor: string;
  aiColor: string;
  playerScore: number;
  aiScore: number;
  difficulty: Difficulty;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  gameState,
  isAnimating,
  onRestart,
  onReturnToMenu,
  playerColor,
  aiColor,
  playerScore,
  aiScore,
  difficulty,
}) => {
  const getStatusText = () => {
    if (gameState === 'finished') return 'Game Over! 💀';
    if (isAnimating) return 'Chain Reaction! 💥';
    if (currentPlayer === 'player') return 'Your Turn 🎯';
    return 'AI Thinking... 🤖';
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'easy':
        return '🌱';
      case 'medium':
        return '🔥';
      case 'hard':
        return '💀';
      default:
        return '🔥';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 w-full max-w-4xl mx-auto space-y-3">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl md:text-4xl font-bold text-red-400 drop-shadow-lg animate-pulse">
          💀 Spread 'Til Dead 💀
        </h1>
        <div
          className="px-3 py-1 rounded-full text-sm font-bold text-white border-2 animate-bounce"
          style={{
            backgroundColor: getDifficultyColor() + '20',
            borderColor: getDifficultyColor(),
            color: getDifficultyColor(),
          }}
        >
          {getDifficultyIcon()} {difficulty.toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full gap-3 md:gap-4">
        <div className="flex items-center justify-center space-x-4">
          {/* You Section */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all
              ${
                currentPlayer === 'player'
                  ? 'border-white bg-white/20 scale-105 animate-pulse'
                  : 'border-white/30 bg-white/10'
              }`}
          >
            <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: playerColor }} />
            <div className="text-white font-bold flex flex-col items-start">
              <span>You 🎯</span>
              <span className="text-sm">Orbs: {playerScore}</span>
            </div>
          </div>

          <span className="text-white font-bold animate-pulse">⚔️ VS ⚔️</span>

          {/* AI Section */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all
              ${
                currentPlayer === 'ai'
                  ? 'border-white bg-white/20 scale-105 animate-pulse'
                  : 'border-white/30 bg-white/10'
              }`}
          >
            <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: aiColor }} />
            <div className="text-white font-bold flex flex-col items-start">
              <span>AI 🤖</span>
              <span className="text-sm">Orbs: {aiScore}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onRestart}
            className="flex items-center space-x-2 p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold border border-white/30 transition hover:scale-105 hover:rotate-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Restart 🔄</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="flex items-center space-x-2 p-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-white font-bold border border-red-400/30 transition hover:scale-105 hover:-rotate-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Menu 🏠</span>
          </button>
        </div>
      </div>

      <div className={`text-lg md:text-2xl font-bold text-white ${isAnimating && 'animate-bounce'}`}>
        {getStatusText()}
      </div>

      {/* Slogan */}
      <div className="text-sm text-yellow-400 font-semibold animate-pulse">
        ⛓️ Chain it. Break it. Rule it. ⛓️
      </div>
    </div>
  );
};