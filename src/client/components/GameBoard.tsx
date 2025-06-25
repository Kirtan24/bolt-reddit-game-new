import React from 'react';
import { Cell } from './Cell';
import { BoardState, Player, Move } from '../types/game';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  validMoves: Move[];
  currentPlayer: Player;
  isAnimating: boolean;
  playerColor: string;
  aiColor: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  validMoves,
  currentPlayer,
  isAnimating,
  playerColor,
  aiColor,
}) => {
  const isValidMove = (row: number, col: number): boolean =>
    validMoves.some((move) => move.row === row && move.col === col);

  const calculateCellSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 400) return '2rem';
    if (screenWidth < 768) return '3rem';
    return '4rem';
  };

  const cellSize = calculateCellSize();

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-6xl mx-auto">
      <div className="bg-black/30 rounded-xl p-3 border border-white/20 overflow-auto">
        <div
          className="grid grid-cols-5 gap-1 md:gap-2"
          style={{
            gridTemplateColumns: `repeat(5, ${cellSize})`,
            gridTemplateRows: `repeat(${board.length}, ${cellSize})`,
            minWidth: `calc(5 * ${cellSize} + 4 * 0.25rem)`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isValid={isValidMove(rowIndex, colIndex)}
                onClick={() => onCellClick(rowIndex, colIndex)}
                disabled={isAnimating || currentPlayer === 'ai'}
                playerColor={playerColor}
                aiColor={aiColor}
                size={cellSize}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
