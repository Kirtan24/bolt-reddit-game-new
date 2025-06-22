import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameHeader } from './GameHeader';
import { GameOverModal } from './GameOverModal';
import { useGameLogic } from '../hooks/useGameLogic';
import { useAI } from '../hooks/useAI';
import { useSoundEffects } from '../hooks/useSoundEffects';

export const ChainReactionGame: React.FC = () => {
  const {
    board,
    currentPlayer,
    gameState,
    winner,
    isAnimating,
    makeMove,
    resetGame,
    getValidMoves,
    aiColor,
    playerColor,
  } = useGameLogic();

  const { makeAIMove } = useAI();
  const { playSound } = useSoundEffects();

  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    if (currentPlayer === 'ai' && gameState === 'playing' && !isAnimating) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(board, getValidMoves());
        if (aiMove) {
          makeMove(aiMove.row, aiMove.col);
          playSound('aiPlace'); // AI-specific sound
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    currentPlayer,
    gameState,
    isAnimating,
    board,
    makeAIMove,
    makeMove,
    getValidMoves,
    playSound,
  ]);

  useEffect(() => {
    if (gameState === 'finished' && winner) {
      setTimeout(() => {
        setShowGameOver(true);
        playSound(winner === 'player' ? 'victory' : 'defeat');
      }, 1000);
    }
  }, [gameState, winner, playSound]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (currentPlayer === 'player' && gameState === 'playing' && !isAnimating) {
        const validMoves = getValidMoves();
        const isValid = validMoves.some((move) => move.row === row && move.col === col);
        if (isValid) {
          makeMove(row, col);
          playSound('playerPlace'); // Player-specific sound
        } else {
          playSound('invalid');
        }
      }
    },
    [currentPlayer, gameState, isAnimating, makeMove, getValidMoves, playSound]
  );

  const handleRestart = useCallback(() => {
    setShowGameOver(false);
    resetGame();
    playSound('restart');
  }, [resetGame, playSound]);

  // Get counts
  const playerCount = board.flat().filter((cell) => cell.owner === 'player').length;
  const aiCount = board.flat().filter((cell) => cell.owner === 'ai').length;

  const backgroundStyle: React.CSSProperties = {
    background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)`,
  };
  if (gameState === 'finished') {
    backgroundStyle.background = `radial-gradient(circle, ${
      winner === 'player' ? playerColor : aiColor
    } 0%, #222 100%)`;
  }

  return (
    <div
      className="fixed inset-0 flex flex-col transition-colors duration-500"
      style={backgroundStyle}
    >
      <div className="flex-shrink-0">
        <GameHeader
          currentPlayer={currentPlayer}
          gameState={gameState}
          isAnimating={isAnimating}
          onRestart={handleRestart}
          playerColor={playerColor}
          aiColor={aiColor}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          validMoves={getValidMoves()}
          currentPlayer={currentPlayer}
          isAnimating={isAnimating}
          playerColor={playerColor}
          aiColor={aiColor}
          playerScore={playerCount}
          aiScore={aiCount}
        />
      </div>
      {showGameOver && (
        <GameOverModal
          winner={winner}
          onRestart={handleRestart}
          onClose={() => setShowGameOver(false)}
        />
      )}
    </div>
  );
};
