import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { GameOverModal } from './GameOverModal';
import { GameModeSelector } from './GameModeSelector';
import { useGameLogic } from '../hooks/useGameLogic';
import { useAI } from '../hooks/useAI';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { Difficulty } from '../types/game';

export const ChainReactionGame: React.FC = () => {
  const {
    board,
    currentPlayer,
    gameState,
    winner,
    isAnimating,
    gameConfig,
    makeMove,
    startGame,
    resetGame,
    returnToMenu,
    getValidMoves,
    aiColor,
    playerColor,
  } = useGameLogic();

  const { makeAIMove } = useAI();
  const { playSound } = useSoundEffects();

  const [showGameOver, setShowGameOver] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    if (currentPlayer === 'ai' && gameState === 'playing' && !isAnimating) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(board, getValidMoves(), gameConfig);
        if (aiMove) {
          makeMove(aiMove.row, aiMove.col);
          playSound('aiPlace');
        }
      }, gameConfig.aiThinkingTime);
      return () => clearTimeout(timer);
    }
  }, [
    currentPlayer,
    gameState,
    isAnimating,
    board,
    gameConfig,
    makeAIMove,
    makeMove,
    getValidMoves,
    playSound,
  ]);

  useEffect(() => {
    if (gameState === 'finished' && winner) {
      const timer = setTimeout(() => {
        setShowGameOver(true);
        playSound(winner === 'player' ? 'victory' : 'defeat');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState, winner, playSound]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (currentPlayer === 'player' && gameState === 'playing' && !isAnimating) {
        const validMoves = getValidMoves();
        const isValid = validMoves.some((move) => move.row === row && move.col === col);
        if (isValid) {
          makeMove(row, col);
          playSound('playerPlace');
        } else {
          playSound('invalid');
        }
      }
    },
    [currentPlayer, gameState, isAnimating, makeMove, getValidMoves, playSound]
  );

  const handleStartGame = useCallback(() => {
    startGame(selectedDifficulty);
    playSound('restart');
  }, [startGame, selectedDifficulty, playSound]);

  const handleRestart = useCallback(() => {
    setShowGameOver(false);
    resetGame();
    playSound('restart');
  }, [resetGame, playSound]);

  const handleReturnToMenu = useCallback(() => {
    setShowGameOver(false);
    returnToMenu();
    playSound('restart');
  }, [returnToMenu, playSound]);

  const playerCount = board.flat().filter((cell) => cell.owner === 'player').length;
  const aiCount = board.flat().filter((cell) => cell.owner === 'ai').length;

  if (gameState === 'menu') {
    return (
      <GameModeSelector
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        onStartGame={handleStartGame}
      />
    );
  }

  const backgroundStyle: React.CSSProperties = {
    background:
      gameState === 'finished'
        ? `radial-gradient(circle, ${winner === 'player' ? playerColor : aiColor} 0%, #222 100%)`
        : 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    minHeight: '100vh',
    overflow: 'auto',
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center transition-colors duration-500 p-4 overflow-hidden"
      style={backgroundStyle}
    >
      {/* Consistent silly background animation - NEVER changes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating skulls */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={`skull-${i}`}
            className="absolute text-2xl opacity-8 animate-pulse"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 12)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '4s',
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            💀
          </div>
        ))}
        
        {/* Floating chains */}
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={`chain-${i}`}
            className="absolute text-xl opacity-6 animate-bounce"
            style={{
              right: `${5 + (i * 20)}%`,
              bottom: `${15 + (i * 15)}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '5s',
            }}
          >
            ⛓️
          </div>
        ))}

        {/* Floating orbs */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-3 h-3 rounded-full opacity-12"
            style={{
              left: `${5 + (i * 12)}%`,
              top: `${10 + (i * 10)}%`,
              backgroundColor: i % 2 === 0 ? '#3B82F6' : '#EF4444',
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Game Header */}
      <div className="w-full flex justify-center relative z-10">
        <GameHeader
          currentPlayer={currentPlayer}
          gameState={gameState}
          isAnimating={isAnimating}
          onRestart={handleRestart}
          onReturnToMenu={handleReturnToMenu}
          playerColor={playerColor}
          aiColor={aiColor}
          aiScore={aiCount}
          playerScore={playerCount}
          difficulty={gameConfig.difficulty}
        />
      </div>

      {/* Game Board - Centered */}
      <div className="flex flex-1 items-center justify-center p-4 relative z-10">
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          validMoves={getValidMoves()}
          currentPlayer={currentPlayer}
          isAnimating={isAnimating}
          playerColor={playerColor}
          aiColor={aiColor}
        />
      </div>

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          winner={winner}
          onRestart={handleRestart}
          onReturnToMenu={handleReturnToMenu}
          onClose={() => setShowGameOver(false)}
          playerColor={playerColor}
          aiColor={aiColor}
          difficulty={gameConfig.difficulty}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};