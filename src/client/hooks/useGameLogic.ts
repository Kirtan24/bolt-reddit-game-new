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
        obstacleCount: 3,
      };
    default:
      return getGameConfig('medium');
  }
};

// Calculate critical mass based on position and difficulty
const getCriticalMass = (row: number, col: number, difficulty: Difficulty): number => {
  if (difficulty === 'easy') {
    return 4; // All cells explode at 4 orbs
  }
  
  if (difficulty === 'medium') {
    const maxIndex = BOARD_SIZE - 1;
    
    // Outermost border
    if (row === 0 || row === maxIndex || col === 0 || col === maxIndex) {
      return 4; // Fixed: Medium mode border should be 4, not 2
    }
    
    // Second layer
    if (row === 1 || row === maxIndex - 1 || col === 1 || col === maxIndex - 1) {
      return 3;
    }
    
    // Inner cells
    return 4;
  }
  
  if (difficulty === 'hard') {
    // Random thresholds for hard mode
    const random = Math.random();
    if (random < 0.3) return 2;
    if (random < 0.6) return 3;
    return 4;
  }
  
  return 4;
};

const createInitialBoard = (config: GameConfig): BoardState => {
  const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      const criticalMass = getCriticalMass(row, col, config.difficulty);
      
      return {
        owner: 'empty' as Player,
        count: 0,
        criticalMass,
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

    if (playerOrbs === 0 && aiOrbs > 0) return 'ai';
    if (aiOrbs === 0 && playerOrbs > 0) return 'player';
    return null;
  }, [board, gameState]);

  const getValidMoves = useCallback((): Move[] => {
    const moves: Move[] = [];
    let playerHasOrbs = false;

    // Check if current player has any orbs on the board
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
          // First move: can place on any empty cell
          if (cell.owner === 'empty') {
            moves.push({ row, col });
          }
        } else {
          // Subsequent moves: can only place on own cells
          if (cell.owner === currentPlayer) {
            moves.push({ row, col });
          }
        }
      }
    }

    return moves;
  }, [board, currentPlayer]);

  const processExplosions = useCallback(async (initialBoard: BoardState): Promise<BoardState> => {
    let currentBoard = initialBoard.map(row => row.map(cell => ({ ...cell })));
    let explosionOccurred = true;
    let iterationCount = 0;
    const maxIterations = 50; // Prevent infinite loops

    while (explosionOccurred && iterationCount < maxIterations) {
      explosionOccurred = false;
      iterationCount++;
      
      const explosions: Move[] = [];

      // Find all cells that should explode
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cell = currentBoard[row][col];
          if (
            !cell.isObstacle &&
            cell.count >= cell.criticalMass &&
            cell.count > 0 &&
            cell.owner !== 'empty'
          ) {
            explosions.push({ row, col });
          }
        }
      }

      if (explosions.length > 0) {
        explosionOccurred = true;

        // Process all explosions simultaneously
        for (const { row, col } of explosions) {
          const explodingCell = currentBoard[row][col];
          const neighbors = getNeighbors(row, col);
          const owner = explodingCell.owner;

          // Clear the exploding cell
          explodingCell.count = 0;
          explodingCell.owner = 'empty';

          // Distribute orbs to neighbors
          for (const neighbor of neighbors) {
            const neighborCell = currentBoard[neighbor.row][neighbor.col];
            if (!neighborCell.isObstacle) {
              neighborCell.count += 1;
              neighborCell.owner = owner;
            }
          }
        }

        // Update the board state and add a small delay for animation
        setBoard(currentBoard.map(row => row.map(cell => ({ ...cell }))));
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    return currentBoard;
  }, []);

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

    if (playerOrbs === 0 && aiOrbs > 0) return 'ai';
    if (aiOrbs === 0 && playerOrbs > 0) return 'player';
    return null;
  }, []);

  const makeMove = useCallback(
    async (row: number, col: number) => {
      if (gameState !== 'playing' || isAnimating) return false;

      const validMoves = getValidMoves();
      const isValidMove = validMoves.some((move) => move.row === row && move.col === col);
      if (!isValidMove) return false;

      setIsAnimating(true);

      // Check if this is the first move for this player
      let playerHasOrbs = false;
      for (const boardRow of board) {
        for (const cell of boardRow) {
          if (cell.owner === currentPlayer) {
            playerHasOrbs = true;
            break;
          }
        }
        if (playerHasOrbs) break;
      }

      // Apply the move with optimized first move logic
      let newBoard = board.map((boardRow, r) =>
        boardRow.map((boardCell, c) => {
          if (r === row && c === col) {
            const cell = { ...boardCell };
            cell.owner = currentPlayer;
            
            if (!playerHasOrbs) {
              // First move: place optimal number of orbs
              const optimalCount = Math.max(1, cell.criticalMass - 1);
              cell.count = optimalCount;
            } else {
              // Regular move: add one orb
              cell.count += 1;
            }
            
            return cell;
          }
          return { ...boardCell };
        })
      );

      setBoard(newBoard);

      // Process explosions
      newBoard = await processExplosions(newBoard);

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
    [board, currentPlayer, gameState, isAnimating, getValidMoves, processExplosions, checkWinCondition]
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