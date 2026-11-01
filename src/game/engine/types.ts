export interface Point { readonly x: number; readonly y: number }
export type Socket = 'circle' | 'square' | 'cross';
export interface Cell extends Point { readonly socket: Socket }
export type Orientation = 0 | 1 | 2 | 3;
export interface PieceType { readonly code: string; readonly cells: readonly Cell[] }
export interface PieceInstance {
  readonly id: string;
  readonly code: string;
  readonly orientation: Orientation;
  readonly mirrored: boolean;
  readonly position: Point | null;
}
export interface Board { readonly width: number; readonly height: number; readonly cells: readonly Cell[] }
export interface Challenge {
  readonly id: string;
  readonly originalNumber?: number;
  readonly category: string;
  readonly pieceCodes: readonly string[];
  readonly source: 'original' | 'generated' | 'demo';
  readonly geometryStatus: 'verified' | 'unverified';
}
export interface Puzzle {
  readonly challenge: Challenge;
  readonly board: Board;
  readonly types: readonly PieceType[];
  readonly allowMirroring: boolean;
}
export interface Snapshot { readonly pieces: readonly PieceInstance[] }
export interface GameState {
  readonly present: Snapshot;
  readonly past: readonly Snapshot[];
  readonly future: readonly Snapshot[];
  readonly selectedId: string | null;
  readonly feedback: { readonly text: string; readonly error: boolean };
}
export type Action =
  | { type: 'SELECT_PIECE'; id: string }
  | { type: 'PLACE_PIECE'; position: Point }
  | { type: 'DROP_PIECE'; id: string; position: Point; orientation: Orientation }
  | { type: 'ROTATE_PIECE' | 'REMOVE_PIECE' | 'UNDO' | 'REDO' | 'RESET' };
export type Validation = { ok: true } | { ok: false; reason: string };
