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
  cell.count += 1;
  
  let hasExplosions = true;
  while (hasExplosions) {
    hasExplosions = false;
    const explosions: Move[] = [];
    
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
        if (cell.count >= 3) {
          playerScore += 2;
        }
      } else if (cell.owner === 'ai') {
        aiScore += cell.count;
        if (cell.count >= 3) {
          aiScore += 2;
        }
      }
    }
  }
  
  if (playerScore === 0 && aiScore > 0) return 1000;
  if (aiScore === 0 && playerScore > 0) return -1000;
  
  return aiScore - playerScore;
};

const getCellValue = (row: number, col: number): number => {
  const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1);
  const isEdge = row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;
  
  if (isCorner) return 3;
  if (isEdge) return 2;
  return 1;
};

export const useAI = () => {
  const makeAIMove = useCallback((board: BoardState, validMoves: Move[], config: GameConfig): Move | null => {
    if (validMoves.length === 0) return null;
    
    const aiMoves: AIMove[] = validMoves.map(move => {
      const simulatedBoard = simulateMove(board, move, 'ai');
      let score = evaluateBoard(simulatedBoard, config);
      
      // Adjust AI behavior based on difficulty
      switch (config.aiSkillLevel) {
        case 1: // Easy
          // Add randomness and make suboptimal moves sometimes
          score += (Math.random() - 0.5) * 10;
          // Reduce strategic thinking
          score *= 0.7;
          break;
          
        case 2: // Medium
          // Standard AI behavior
          score += getCellValue(move.row, move.col);
          break;
          
        case 3: // Hard
          // Enhanced strategic thinking
          score += getCellValue(move.row, move.col) * 2;
          
          // Look ahead for opponent threats
          const neighbors = getNeighbors(move.row, move.col);
          for (const neighbor of neighbors) {
            const neighborCell = board[neighbor.row][neighbor.col];
            if (neighborCell.owner === 'player' && neighborCell.count >= 3) {
              score -= 5; // Avoid helping opponent
            }
          }
          
          // Bonus for aggressive plays
          const cell = board[move.row][move.col];
          if (cell.owner === 'empty') {
            score += 2; // Expansion bonus
          }
          break;
      }
      
      return { ...move, score };
    });
    
    aiMoves.sort((a, b) => b.score - a.score);
    
    // Add difficulty-based randomness
    let selectedMove: Move;
    
    switch (config.aiSkillLevel) {
      case 1: // Easy - often pick suboptimal moves
        const randomFactor = Math.random();
        if (randomFactor < 0.4) {
          // 40% chance to pick a random move
          selectedMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
        } else {
          // 60% chance to pick from top 3 moves
          const topMoves = aiMoves.slice(0, Math.min(3, aiMoves.length));
          selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
        }
        break;
        
      case 2: // Medium - balanced approach
        const topMoves = aiMoves.filter(move => move.score >= aiMoves[0].score - 3);
        selectedMove = topMoves[Math.floor(Math.random() * Math.min(2, topMoves.length))];
        break;
        
      case 3: // Hard - almost always pick the best move
        if (Math.random() < 0.9) {
          selectedMove = aiMoves[0]; // 90% best move
        } else {
          selectedMove = aiMoves[Math.min(1, aiMoves.length - 1)]; // 10% second best
        }
        break;
        
      default:
        selectedMove = aiMoves[0];
    }
    
    return selectedMove;
  }, []);

  return { makeAIMove };
};