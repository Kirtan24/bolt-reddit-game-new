export type Player = 'empty' | 'player' | 'ai';
export type GameState = 'menu' | 'playing' | 'finished';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CellData {
  owner: Player;
  count: number;
  criticalMass: number;
  isObstacle?: boolean;
}

export type BoardState = CellData[][];

export interface Move {
  row: number;
  col: number;
}

export interface GameStats {
  playerOrbs: number;
  aiOrbs: number;
  totalMoves: number;
}

export interface ExplosionEvent {
  row: number;
  col: number;
  timestamp: number;
}

export interface GameConfig {
  difficulty: Difficulty;
  aiThinkingTime: number;
  aiSkillLevel: number;
  obstacleCount: number;
}