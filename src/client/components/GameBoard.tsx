import React from 'react';
import { Cell } from './Cell';
import { BoardState, Player, Move } from '../types/game';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number, event: React.MouseEvent) => void;
  validMoves: Move[];
  currentPlayer: Player;
  isAnimating: boolean;
  playerColor: string;
  aiColor: string;
  playerScore: number;
  aiScore: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  validMoves,
  currentPlayer,
  isAnimating,
  playerColor,
  aiColor,
  playerScore,
  aiScore,
}) => {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  return (
    <div className="flex items-center justify-center space-x-8">
      {/* Left Score Panel */}
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl backdrop-blur-sm bg-black/30 border border-white/20 shadow-2xl">
        <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: playerColor }} />
        <span className="text-2xl font-bold text-white">{playerScore}</span>
      </div>

      {/* Game Board */}
      <div className="relative bg-black/30 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="grid grid-cols-5 gap-3 w-[400px] h-[400px]">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isValid={isValidMove(rowIndex, colIndex)}
                onClick={(event) => onCellClick(rowIndex, colIndex, event)}
                disabled={isAnimating || currentPlayer === 'ai'}
                playerColor={playerColor}
                aiColor={aiColor}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Score Panel */}
      <div className="flex flex-col items-center justify-center p-4 rounded-2xl backdrop-blur-sm bg-black/30 border border-white/20 shadow-2xl">
        <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: aiColor }} />
        <span className="text-2xl font-bold text-white">{aiScore}</span>
      </div>
    </div>
  );
};
