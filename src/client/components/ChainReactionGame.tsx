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
    playSound('modeSelect');
  }, [startGame, selectedDifficulty, playSound]);

  const handleRestart = useCallback(() => {
    setShowGameOver(false);
    resetGame();
    playSound('restart');
  }, [resetGame, playSound]);

  const handleReturnToMenu = useCallback(() => {
    setShowGameOver(false);
    returnToMenu();
    playSound('menuReturn');
  }, [returnToMenu, playSound]);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    playSound('modeSelect');
  }, [playSound]);

  const playerCount = board.flat().filter((cell) => cell.owner === 'player').length;
  const aiCount = board.flat().filter((cell) => cell.owner === 'ai').length;

  if (gameState === 'menu') {
    return (
      <GameModeSelector
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={handleDifficultyChange}
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
      className="fixed inset-0 flex flex-col items-center justify-center transition-colors duration-500 p-4"
      style={backgroundStyle}
    >
      {/* Game Header */}
      <div className="w-full flex justify-center">
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
      <div className="flex flex-1 items-center justify-center p-4">
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
    </div>
  );
};