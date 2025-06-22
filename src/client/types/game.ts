export type Player = 'empty' | 'player' | 'ai';
export type GameState = 'playing' | 'finished';

export interface CellData {
  owner: Player;
  count: number;
  criticalMass: number;
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