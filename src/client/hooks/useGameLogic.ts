import { useState, useCallback, useMemo } from 'react';
import { BoardState, CellData, Player, GameState, Move } from '../types/game';

const BOARD_SIZE = 5;

// Extended color palette for more variety
const COLORS = ['blue', 'green', 'purple', 'pink', 'red', 'orange', 'yellow'];

const getRandomColors = () => {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
  return {
    playerColor: shuffled[0],
    aiColor: shuffled[1],
  };
};

const createInitialBoard = (): BoardState => {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      return {
        owner: 'empty' as Player,
        count: 0,
        criticalMass: 4,
      };
    })
  );
};

const getNeighbors = (row: number, col: number): Move[] => {
  const neighbors: Move[] = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
};

export const useGameLogic = () => {
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isAnimating, setIsAnimating] = useState(false);
  const [colors] = useState(() => getRandomColors());

  const { playerColor, aiColor } = colors;

  const winner = useMemo(() => {
    if (gameState !== 'finished') return null;

    let playerOrbs = 0;
    let aiOrbs = 0;

    for (const row of board) {
      for (const cell of row) {
        if (cell.owner === 'player') playerOrbs += cell.count;
        if (cell.owner === 'ai') aiOrbs += cell.count;
      }
    }

    if (playerOrbs === 0) return 'ai';
    if (aiOrbs === 0) return 'player';
    return null;
  }, [board, gameState]);

  const getValidMoves = useCallback((): Move[] => {
    const moves: Move[] = [];

    let playerHasOrbs = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (cell.owner === currentPlayer) {
          playerHasOrbs = true;
          break;
        }
      }
      if (playerHasOrbs) break;
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = board[row][col];

        if (!playerHasOrbs) {
          if (cell.owner === 'empty') {
            moves.push({ row, col });
          }
        } else {
          if (cell.owner === currentPlayer) {
            moves.push({ row, col });
          }
        }
      }
    }

    return moves;
  }, [board, currentPlayer]);

  const processExplosions = useCallback((initialBoard: BoardState): BoardState => {
    let newBoard = initialBoard.map((row) => row.map((cell) => ({ ...cell })));
    let hasExplosions = true;

    while (hasExplosions) {
      hasExplosions = false;
      const explosions: Move[] = [];

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cell = newBoard[row][col];
          if (cell.count >= cell.criticalMass && cell.count > 0) {
            explosions.push({ row, col });
          }
        }
      }

      if (explosions.length > 0) {
        hasExplosions = true;

        for (const { row, col } of explosions) {
          const explodingCell = newBoard[row][col];
          const neighbors = getNeighbors(row, col);
          const explodingPlayer = explodingCell.owner;

          explodingCell.count = 0;
          explodingCell.owner = 'empty';

          for (const neighbor of neighbors) {
            const neighborCell = newBoard[neighbor.row][neighbor.col];
            neighborCell.count += 1;
            neighborCell.owner = explodingPlayer;
          }
        }
      }
    }

    return newBoard;
  }, []);

  const checkWinCondition = useCallback((board: BoardState): Player | null => {
    let playerOrbs = 0;
    let aiOrbs = 0;

    for (const row of board) {
      for (const cell of row) {
        if (cell.owner === 'player') playerOrbs += cell.count;
        if (cell.owner === 'ai') aiOrbs += cell.count;
      }
    }

    const totalOrbs = playerOrbs + aiOrbs;
    if (totalOrbs < 2) return null;

    if (playerOrbs === 0) return 'ai';
    if (aiOrbs === 0) return 'player';
    return null;
  }, []);

  const makeMove = useCallback(
    (row: number, col: number) => {
      if (gameState !== 'playing' || isAnimating) return false;

      const validMoves = getValidMoves();
      const isValidMove = validMoves.some((move) => move.row === row && move.col === col);

      if (!isValidMove) return false;

      // Immediately update the board for instant feedback
      const newBoard = board.map((boardRow, r) =>
        boardRow.map((boardCell, c) => {
          if (r === row && c === col) {
            return {
              ...boardCell,
              owner: currentPlayer,
              count: boardCell.count + 1,
            };
          }
          return { ...boardCell };
        })
      );

      // Set board immediately for instant visual feedback
      setBoard(newBoard);
      setIsAnimating(true);

      // Process explosions and check win condition
      const finalBoard = processExplosions(newBoard);
      const gameWinner = checkWinCondition(finalBoard);

      // Use a much shorter delay for smoother gameplay
      setTimeout(() => {
        setBoard(finalBoard);

        if (gameWinner) {
          setGameState('finished');
        } else {
          setCurrentPlayer(currentPlayer === 'player' ? 'ai' : 'player');
        }

        setIsAnimating(false);
      }, 150); // Reduced from 500ms to 150ms for much faster response

      return true;
    },
    [
      board,
      currentPlayer,
      gameState,
      isAnimating,
      processExplosions,
      checkWinCondition,
      getValidMoves,
    ]
  );

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentPlayer('player');
    setGameState('playing');
    setIsAnimating(false);
    // Don't regenerate colors on reset - keep them for the session
  }, []);

  return {
    board,
    currentPlayer,
    gameState,
    winner,
    isAnimating,
    makeMove,
    resetGame,
    getValidMoves,
    playerColor,
    aiColor,
  };
};