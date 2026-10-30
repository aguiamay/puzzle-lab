import type { Cell, PieceInstance, Point, Puzzle, Snapshot } from './types';
import { transform, translate } from './transformations';
export const key = (p: Point): string => `${p.x},${p.y}`;
export function localCells(puzzle: Puzzle, piece: PieceInstance): Cell[] {
  const type = puzzle.types.find(t => t.code === piece.code);
  return type ? transform(type.cells, piece.orientation, piece.mirrored) : [];
}
export function placedCells(puzzle: Puzzle, piece: PieceInstance): Cell[] {
  return piece.position ? translate(localCells(puzzle, piece), piece.position) : [];
}
export function occupancy(puzzle: Puzzle, snapshot: Snapshot): Record<string, string> {
  const occupied: Record<string, string> = {};
  for (const piece of snapshot.pieces) {
    for (const cell of placedCells(puzzle, piece)) occupied[key(cell)] = piece.id;
  }
  return occupied;
}
