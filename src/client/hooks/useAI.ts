import { useCallback } from 'react';
import { BoardState, Move, Player, GameConfig } from '../types/game';

interface AIMove extends Move {
  score: number;
}

const BOARD_SIZE = 5;

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

// Simulate a complete move including all chain reactions
const simulateMove = (board: BoardState, move: Move, player: Player): BoardState => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  // Apply initial move
  const cell = newBoard[move.row][move.col];
  cell.owner = player;
  cell.count += 1;

  // Process all chain reactions
  let hasExplosions = true;
  while (hasExplosions) {
    hasExplosions = false;
    const explosions: Move[] = [];

    // Find all cells that should explode
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const currentCell = newBoard[row][col];
        if (!currentCell.isObstacle && currentCell.count >= 4 && currentCell.count > 0) {
          explosions.push({ row, col });
        }
      }
    }

    if (explosions.length > 0) {
      hasExplosions = true;

      // Process all explosions
      for (const explosion of explosions) {
        const explodingCell = newBoard[explosion.row][explosion.col];
        const neighbors = getNeighbors(explosion.row, explosion.col);
        const explodingPlayer = explodingCell.owner;

        explodingCell.count = 0;
        explodingCell.owner = 'empty';

        for (const neighbor of neighbors) {
          const neighborCell = newBoard[neighbor.row][neighbor.col];
          if (!neighborCell.isObstacle) {
            neighborCell.count += 1;
            neighborCell.owner = explodingPlayer;
          }
        }
      }
    }
  }

  return newBoard;
};

// Advanced board evaluation function
const evaluateBoard = (board: BoardState, config: GameConfig): number => {
  let playerScore = 0;
  let aiScore = 0;
  let playerCells = 0;
  let aiCells = 0;
  let playerNearCritical = 0;
  let aiNearCritical = 0;
  let playerPositionalValue = 0;
  let aiPositionalValue = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      
      if (cell.isObstacle) continue;

      // Positional values (corners and edges are more valuable)
      const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1);
      const isEdge = row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;
      const posValue = isCorner ? 3 : isEdge ? 2 : 1;

      if (cell.owner === 'player') {
        playerScore += cell.count;
        playerCells++;
        playerPositionalValue += posValue;
        if (cell.count >= 3) {
          playerNearCritical++;
        }
      } else if (cell.owner === 'ai') {
        aiScore += cell.count;
        aiCells++;
        aiPositionalValue += posValue;
        if (cell.count >= 3) {
          aiNearCritical++;
        }
      }
    }
  }

  // Check for immediate win/loss
  if (playerScore === 0 && aiScore > 0) return 1000;
  if (aiScore === 0 && playerScore > 0) return -1000;

  // Calculate comprehensive score
  let score = 0;
  
  // Basic orb count difference
  score += (aiScore - playerScore) * 2;
  
  // Cell control bonus
  score += (aiCells - playerCells) * 3;
  
  // Positional advantage
  score += (aiPositionalValue - playerPositionalValue);
  
  // Near-critical mass bonus (potential for chain reactions)
  score += (aiNearCritical - playerNearCritical) * 2;

  return score;
};

// Get strategic value of a position
const getCellValue = (row: number, col: number): number => {
  const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1);
  const isEdge = row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;
  const isCenter = row === 2 && col === 2;

  if (isCorner) return 4; // Corners are very safe
  if (isEdge) return 2;   // Edges are moderately safe
  if (isCenter) return 1; // Center is risky but can spread in all directions
  return 1.5; // Inner positions
};

// Look ahead function for advanced AI
const minimax = (board: BoardState, depth: number, isMaximizing: boolean, alpha: number, beta: number, config: GameConfig): number => {
  if (depth === 0) {
    return evaluateBoard(board, config);
  }

  const currentPlayer = isMaximizing ? 'ai' : 'player';
  const validMoves = getValidMovesForBoard(board, currentPlayer);

  if (validMoves.length === 0) {
    return evaluateBoard(board, config);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = simulateMove(board, move, currentPlayer);
      const eval_ = minimax(newBoard, depth - 1, false, alpha, beta, config);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = simulateMove(board, move, currentPlayer);
      const eval_ = minimax(newBoard, depth - 1, true, alpha, beta, config);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
};

// Get valid moves for a specific board state and player
const getValidMovesForBoard = (board: BoardState, player: Player): Move[] => {
  const moves: Move[] = [];
  let playerHasOrbs = false;

  // Check if player has any orbs on the board
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].owner === player) {
        playerHasOrbs = true;
        break;
      }
    }
    if (playerHasOrbs) break;
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];

      if (cell.isObstacle) continue;

      if (!playerHasOrbs) {
        if (cell.owner === 'empty') {
          moves.push({ row, col });
        }
      } else {
        if (cell.owner === player) {
          moves.push({ row, col });
        }
      }
    }
  }

  return moves;
};

export const useAI = () => {
  const makeAIMove = useCallback(
    (board: BoardState, validMoves: Move[], config: GameConfig): Move | null => {
      if (validMoves.length === 0) return null;

      const aiMoves: AIMove[] = validMoves.map((move) => {
        const simulatedBoard = simulateMove(board, move, 'ai');
        let score = evaluateBoard(simulatedBoard, config);

        // Apply difficulty-specific logic
        switch (config.aiSkillLevel) {
          case 1: // Easy - Simple and sometimes random
            score += getCellValue(move.row, move.col);
            // Add significant randomness
            score += (Math.random() - 0.5) * 15;
            // Reduce strategic thinking
            score *= 0.6;
            break;

          case 2: // Medium - Balanced with some lookahead
            score += getCellValue(move.row, move.col) * 2;
            
            // Simple threat detection
            const neighbors = getNeighbors(move.row, move.col);
            for (const neighbor of neighbors) {
              const neighborCell = board[neighbor.row][neighbor.col];
              if (neighborCell.owner === 'player' && neighborCell.count >= 3) {
                score -= 3; // Avoid helping opponent
              }
            }

            // Add moderate randomness
            score += (Math.random() - 0.5) * 8;
            break;

          case 3: // Hard - Advanced with minimax lookahead
            // Use minimax for deeper analysis
            const minimaxScore = minimax(simulatedBoard, 2, false, -Infinity, Infinity, config);
            score += minimaxScore * 0.5;
            
            score += getCellValue(move.row, move.col) * 3;

            // Advanced threat and opportunity detection
            const cell = board[move.row][move.col];
            
            // Bonus for creating near-critical masses
            if (cell.count === 2) {
              score += 4; // Setting up for next turn
            }
            
            // Penalty for moves that help opponent
            const moveNeighbors = getNeighbors(move.row, move.col);
            for (const neighbor of moveNeighbors) {
              const neighborCell = board[neighbor.row][neighbor.col];
              if (neighborCell.owner === 'player' && neighborCell.count >= 2) {
                score -= 5; // Avoid helping opponent
              }
            }

            // Bonus for aggressive expansion
            if (cell.owner === 'empty') {
              score += 3; // Expansion bonus
            }

            // Minimal randomness for unpredictability
            score += (Math.random() - 0.5) * 2;
            break;
        }

        return { ...move, score };
      });

      // Sort moves by score
      aiMoves.sort((a, b) => b.score - a.score);

      // Select move based on difficulty
      let selectedMove: Move;

      switch (config.aiSkillLevel) {
        case 1: // Easy - Often pick suboptimal moves
          if (Math.random() < 0.4) {
            // 40% chance to pick a random move
            selectedMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
          } else {
            // 60% chance to pick from top 3 moves
            const topMoves = aiMoves.slice(0, Math.min(3, aiMoves.length));
            selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
          }
          break;

        case 2: // Medium - Balanced approach
          if (Math.random() < 0.7) {
            // 70% chance to pick best move
            selectedMove = aiMoves[0];
          } else {
            // 30% chance to pick second best
            selectedMove = aiMoves[Math.min(1, aiMoves.length - 1)];
          }
          break;

        case 3: // Hard - Almost always optimal
          if (Math.random() < 0.95) {
            // 95% chance to pick best move
            selectedMove = aiMoves[0];
          } else {
            // 5% chance to pick second best for unpredictability
            selectedMove = aiMoves[Math.min(1, aiMoves.length - 1)];
          }
          break;

        default:
          selectedMove = aiMoves[0];
      }

      return selectedMove;
    },
    []
  );

  return { makeAIMove };
};