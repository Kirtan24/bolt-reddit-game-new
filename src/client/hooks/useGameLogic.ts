import { useState, useCallback, useMemo } from 'react';
import { BoardState, CellData, Player, GameState, Move, Difficulty, GameConfig } from '../types/game';

const BOARD_SIZE = 5;

const COLORS = [
  '#007BFF', // Bright Blue
  '#DC3545', // Strong Red
  '#198754', // Strong Green
  '#FFC107', // Vivid Yellow
  '#6610F2', // Strong Purple
  '#FD7E14', // Bright Orange
  '#20C997', // Teal
  '#E83E8C', // Magenta
  '#17A2B8', // Cyan
  '#6F42C1', // Dark Purple
];

const getRandomColors = () => {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
  return {
    playerColor: shuffled[0],
    aiColor: shuffled[1],
  };
};

const getGameConfig = (difficulty: Difficulty): GameConfig => {
  switch (difficulty) {
    case 'easy':
      return {
        difficulty,
        aiThinkingTime: 1200,
        aiSkillLevel: 1,
        obstacleCount: 0,
      };
    case 'medium':
      return {
        difficulty,
        aiThinkingTime: 800,
        aiSkillLevel: 2,
        obstacleCount: 0,
      };
    case 'hard':
      return {
        difficulty,
        aiThinkingTime: 600,
        aiSkillLevel: 3,
        obstacleCount: 3, // 3 random obstacles
      };
    default:
      return getGameConfig('medium');
  }
};

const createInitialBoard = (config: GameConfig): BoardState => {
  const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      return {
        owner: 'empty' as Player,
        count: 0,
        criticalMass: 4,
        isObstacle: false,
      };
    })
  );

  // Add obstacles for hard mode
  if (config.difficulty === 'hard' && config.obstacleCount > 0) {
    const obstacles = new Set<string>();

    while (obstacles.size < config.obstacleCount) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      const key = `${row}-${col}`;

      // Avoid center cell and corners for better gameplay
      if (
        (row === 2 && col === 2) || // center
        (row === 0 && col === 0) || // corners
        (row === 0 && col === BOARD_SIZE - 1) ||
        (row === BOARD_SIZE - 1 && col === 0) ||
        (row === BOARD_SIZE - 1 && col === BOARD_SIZE - 1)
      ) {
        continue;
      }

      if (!obstacles.has(key)) {
        obstacles.add(key);
        board[row][col].isObstacle = true;
      }
    }
  }

  return board;
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
  const [gameConfig, setGameConfig] = useState<GameConfig>(getGameConfig('medium'));
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard(gameConfig));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
  const [gameState, setGameState] = useState<GameState>('menu');
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
        if (board[row][col].owner === currentPlayer) {
          playerHasOrbs = true;
          break;
        }
      }
      if (playerHasOrbs) break;
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = board[row][col];

        // Skip obstacles
        if (cell.isObstacle) continue;

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

  const getNextExplosionStep = (state: BoardState): BoardState | null => {
    const newBoard = state.map((row) => row.map((cell) => ({ ...cell })));
    const explosions: Move[] = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = newBoard[row][col];
        if (
          !cell.isObstacle &&
          cell.count >= cell.criticalMass &&
          cell.count > 0
        ) {
          explosions.push({ row, col });
        }
      }
    }

    if (explosions.length === 0) {
      return null;
    }

    for (const { row, col } of explosions) {
      const explodingCell = newBoard[row][col];
      const neighbors = getNeighbors(row, col);
      const owner = explodingCell.owner;

      explodingCell.count = 0;
      explodingCell.owner = 'empty';

      for (const neighbor of neighbors) {
        const neighborCell = newBoard[neighbor.row][neighbor.col];
        // Don't add orbs to obstacles
        if (!neighborCell.isObstacle) {
          neighborCell.count += 1;
          neighborCell.owner = owner;
        }
      }
    }

    return newBoard;
  };

  const checkWinCondition = useCallback((state: BoardState): Player | null => {
    let playerOrbs = 0;
    let aiOrbs = 0;

    for (const row of state) {
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
    async (row: number, col: number) => {
      if (gameState !== 'playing' || isAnimating) return false;

      const validMoves = getValidMoves();
      const isValidMove = validMoves.some((move) => move.row === row && move.col === col);
      if (!isValidMove) return false;

      setIsAnimating(true);

      // Apply the click
      let newBoard = board.map((boardRow, r) =>
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
      setBoard(newBoard);

      // Process explosions
      while (true) {
        const nextStep = getNextExplosionStep(newBoard);
        if (!nextStep) break;

        newBoard = nextStep;
        setBoard(newBoard);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Check for winner
      const gameWinner = checkWinCondition(newBoard);
      if (gameWinner) {
        setGameState('finished');
        setIsAnimating(false);
      } else {
        setCurrentPlayer(currentPlayer === 'player' ? 'ai' : 'player');
        setIsAnimating(false);
      }

      return true;
    },
    [board, currentPlayer, gameState, isAnimating, getValidMoves, checkWinCondition]
  );

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = getGameConfig(difficulty);
    setGameConfig(config);
    setBoard(createInitialBoard(config));
    setCurrentPlayer('player');
    setGameState('playing');
    setIsAnimating(false);
  }, []);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard(gameConfig));
    setCurrentPlayer('player');
    setGameState('playing');
    setIsAnimating(false);
  }, [gameConfig]);

  const returnToMenu = useCallback(() => {
    setGameState('menu');
    setCurrentPlayer('player');
    setIsAnimating(false);
  }, []);

  return {
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
    playerColor,
    aiColor,
  };
};