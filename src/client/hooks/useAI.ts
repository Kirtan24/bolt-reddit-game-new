import { useCallback } from 'react';
import { BoardState, Move, Player, GameConfig } from '../types/game';

interface AIMove extends Move {
  score: number;
}

const BOARD_SIZE = 5;

const getNeighbors = (row: number, col: number): Move[] => {
  const neighbors: Move[] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};

const simulateMove = (board: BoardState, move: Move, player: Player): BoardState => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  const cell = newBoard[move.row][move.col];
  cell.owner = player;
  
  // Check if this is the first move for this player
  let playerHasOrbs = false;
  for (const row of board) {
    for (const boardCell of row) {
      if (boardCell.owner === player) {
        playerHasOrbs = true;
        break;
      }
    }
    if (playerHasOrbs) break;
  }
  
  if (!playerHasOrbs) {
    // First move: place optimal number of orbs
    cell.count = Math.max(1, cell.criticalMass - 1);
  } else {
    // Regular move: add one orb
    cell.count += 1;
  }
  
  // Process explosions
  let hasExplosions = true;
  let iterationCount = 0;
  const maxIterations = 50;
  
  while (hasExplosions && iterationCount < maxIterations) {
    hasExplosions = false;
    iterationCount++;
    const explosions: Move[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const currentCell = newBoard[row][col];
        if (!currentCell.isObstacle && currentCell.count >= currentCell.criticalMass && currentCell.count > 0 && currentCell.owner !== 'empty') {
          explosions.push({ row, col });
        }
      }
    }
    
    if (explosions.length > 0) {
      hasExplosions = true;
      
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

const evaluateBoard = (board: BoardState, config: GameConfig): number => {
  let playerScore = 0;
  let aiScore = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      
      if (cell.owner === 'player') {
        playerScore += cell.count;
        // Bonus for cells near critical mass
        if (cell.count >= cell.criticalMass - 1) {
          playerScore += 3;
        }
        // Position bonus
        playerScore += getPositionValue(row, col);
      } else if (cell.owner === 'ai') {
        aiScore += cell.count;
        // Bonus for cells near critical mass
        if (cell.count >= cell.criticalMass - 1) {
          aiScore += 3;
        }
        // Position bonus
        aiScore += getPositionValue(row, col);
      }
    }
  }
  
  // Check for winning/losing positions
  if (playerScore === 0 && aiScore > 0) return 1000;
  if (aiScore === 0 && playerScore > 0) return -1000;
  
  return aiScore - playerScore;
};

const getPositionValue = (row: number, col: number): number => {
  const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1);
  const isEdge = row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;
  const isCenter = row === 2 && col === 2;
  
  if (isCenter) return 4; // Center is most valuable
  if (isCorner) return 2; // Corners are safer
  if (isEdge) return 3; // Edges are good
  return 3; // Inner positions
};

const getStrategicValue = (board: BoardState, move: Move, player: Player): number => {
  let value = 0;
  const cell = board[move.row][move.col];
  
  // Prefer moves that are close to critical mass
  if (cell.count >= cell.criticalMass - 2) {
    value += 5;
  }
  
  // Check for potential chain reactions
  const neighbors = getNeighbors(move.row, move.col);
  for (const neighbor of neighbors) {
    const neighborCell = board[neighbor.row][neighbor.col];
    if (neighborCell.owner === player && neighborCell.count >= neighborCell.criticalMass - 1) {
      value += 3; // Can trigger neighbor explosion
    }
    if (neighborCell.owner !== player && neighborCell.owner !== 'empty' && neighborCell.count >= neighborCell.criticalMass - 1) {
      value -= 2; // Might help opponent
    }
  }
  
  return value;
};

export const useAI = () => {
  const makeAIMove = useCallback((board: BoardState, validMoves: Move[], config: GameConfig): Move | null => {
    if (validMoves.length === 0) return null;
    
    const aiMoves: AIMove[] = validMoves.map(move => {
      const simulatedBoard = simulateMove(board, move, 'ai');
      let score = evaluateBoard(simulatedBoard, config);
      
      // Add strategic considerations
      score += getStrategicValue(board, move, 'ai');
      score += getPositionValue(move.row, move.col);
      
      // Adjust AI behavior based on difficulty
      switch (config.aiSkillLevel) {
        case 1: // Easy
          // Add significant randomness and make suboptimal moves
          score += (Math.random() - 0.5) * 20;
          score *= 0.6; // Reduce strategic thinking
          break;
          
        case 2: // Medium
          // Standard AI behavior with slight randomness
          score += (Math.random() - 0.5) * 5;
          break;
          
        case 3: // Hard
          // Enhanced strategic thinking
          score += getPositionValue(move.row, move.col) * 2;
          
          // Look ahead for opponent threats and opportunities
          const neighbors = getNeighbors(move.row, move.col);
          for (const neighbor of neighbors) {
            const neighborCell = board[neighbor.row][neighbor.col];
            if (neighborCell.owner === 'player' && neighborCell.count >= neighborCell.criticalMass - 1) {
              score -= 8; // Avoid helping opponent
            }
            if (neighborCell.owner === 'ai' && neighborCell.count >= neighborCell.criticalMass - 1) {
              score += 6; // Create chain opportunities
            }
          }
          
          // Bonus for aggressive expansion
          const cell = board[move.row][move.col];
          if (cell.owner === 'empty') {
            score += 4; // Expansion bonus
          }
          
          // Defensive considerations
          let playerThreats = 0;
          for (const validMove of validMoves) {
            const testBoard = simulateMove(board, validMove, 'player');
            const testScore = evaluateBoard(testBoard, config);
            if (testScore < -50) playerThreats++;
          }
          
          if (playerThreats > 0) {
            score += 10; // Defensive bonus when player has threats
          }
          break;
      }
      
      return { ...move, score };
    });
    
    aiMoves.sort((a, b) => b.score - a.score);
    
    // Add difficulty-based move selection
    let selectedMove: Move;
    
    switch (config.aiSkillLevel) {
      case 1: // Easy - often pick suboptimal moves
        const randomFactor = Math.random();
        if (randomFactor < 0.5) {
          // 50% chance to pick a random move
          selectedMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
        } else {
          // 50% chance to pick from top 3 moves
          const topMoves = aiMoves.slice(0, Math.min(3, aiMoves.length));
          selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
        }
        break;
        
      case 2: // Medium - balanced approach
        const topMoves = aiMoves.filter(move => move.score >= aiMoves[0].score - 5);
        selectedMove = topMoves[Math.floor(Math.random() * Math.min(2, topMoves.length))];
        break;
        
      case 3: // Hard - almost always pick the best move
        if (Math.random() < 0.95) {
          selectedMove = aiMoves[0]; // 95% best move
        } else {
          selectedMove = aiMoves[Math.min(1, aiMoves.length - 1)]; // 5% second best
        }
        break;
        
      default:
        selectedMove = aiMoves[0];
    }
    
    return selectedMove;
  }, []);

  return { makeAIMove };
};