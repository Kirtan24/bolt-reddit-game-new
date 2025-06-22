import { useCallback } from 'react';
import { BoardState, Move, Player } from '../types/game';

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
  // Create a deep copy of the board
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  // Make the move
  const cell = newBoard[move.row][move.col];
  cell.owner = player;
  cell.count += 1;
  
  // Process explosions
  let hasExplosions = true;
  while (hasExplosions) {
    hasExplosions = false;
    const explosions: Move[] = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const currentCell = newBoard[row][col];
        if (currentCell.count >= 4 && currentCell.count > 0) { // All cells explode at 4
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
          neighborCell.count += 1;
          neighborCell.owner = explodingPlayer;
        }
      }
    }
  }
  
  return newBoard;
};

const evaluateBoard = (board: BoardState): number => {
  let playerScore = 0;
  let aiScore = 0;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      
      if (cell.owner === 'player') {
        playerScore += cell.count;
        // Bonus for cells near critical mass
        if (cell.count >= 3) {
          playerScore += 2;
        }
      } else if (cell.owner === 'ai') {
        aiScore += cell.count;
        // Bonus for cells near critical mass
        if (cell.count >= 3) {
          aiScore += 2;
        }
      }
    }
  }
  
  // Check for win conditions
  if (playerScore === 0 && aiScore > 0) return 1000; // AI wins
  if (aiScore === 0 && playerScore > 0) return -1000; // Player wins
  
  return aiScore - playerScore;
};

const getCellValue = (row: number, col: number): number => {
  // Corner cells are more valuable (harder to lose)
  const isCorner = (row === 0 || row === BOARD_SIZE - 1) && (col === 0 || col === BOARD_SIZE - 1);
  const isEdge = row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;
  
  if (isCorner) return 3;
  if (isEdge) return 2;
  return 1;
};

export const useAI = () => {
  const makeAIMove = useCallback((board: BoardState, validMoves: Move[]): Move | null => {
    if (validMoves.length === 0) return null;
    
    const aiMoves: AIMove[] = validMoves.map(move => {
      // Simulate the move
      const simulatedBoard = simulateMove(board, move, 'ai');
      
      // Evaluate the resulting board
      let score = evaluateBoard(simulatedBoard);
      
      // Add positional bonus
      score += getCellValue(move.row, move.col);
      
      // Bonus for expanding to new territory
      const cell = board[move.row][move.col];
      if (cell.owner === 'empty') {
        score += 1;
      }
      
      // Penalty for moves that set up opponent's big chains
      const neighbors = getNeighbors(move.row, move.col);
      for (const neighbor of neighbors) {
        const neighborCell = board[neighbor.row][neighbor.col];
        if (neighborCell.owner === 'player' && neighborCell.count >= 3) {
          score -= 3; // Avoid helping opponent
        }
      }
      
      return { ...move, score };
    });
    
    // Sort by score (highest first)
    aiMoves.sort((a, b) => b.score - a.score);
    
    // Add some randomness to make AI less predictable
    const topMoves = aiMoves.filter(move => move.score >= aiMoves[0].score - 2);
    const randomIndex = Math.floor(Math.random() * Math.min(3, topMoves.length));
    
    return topMoves[randomIndex] || aiMoves[0];
  }, []);

  return { makeAIMove };
};