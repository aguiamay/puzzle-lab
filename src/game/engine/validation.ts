import type { Puzzle, Snapshot } from './types';
import { key, occupancy } from './geometry';
import { validatePlacement } from './placement';
export function isComplete(puzzle: Puzzle, snapshot: Snapshot): boolean {
  const expected = [...puzzle.challenge.pieceCodes].sort();
  const actual = snapshot.pieces.map(p => p.code).sort();
  if (JSON.stringify(expected) !== JSON.stringify(actual)) return false;
  if (new Set(snapshot.pieces.map(p => p.id)).size !== snapshot.pieces.length) return false;
  const placed: Snapshot = { pieces: snapshot.pieces.map(p => ({ ...p, position: null })) };
  let checked = placed;
  for (const piece of snapshot.pieces) {
    if (!piece.position || !validatePlacement(puzzle, checked, piece, piece.position).ok) return false;
    checked = { pieces: checked.pieces.map(p => p.id === piece.id ? piece : p) };
  }
  const occupied = occupancy(puzzle, checked);
  return Object.keys(occupied).length === puzzle.board.cells.length && puzzle.board.cells.every(c => occupied[key(c)]);
}
