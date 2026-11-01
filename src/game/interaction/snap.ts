import { validAnchors } from '../engine/placement';
import type { Point, Puzzle, Snapshot, PieceInstance } from '../engine/types';

// Raio em unidades de célula, com histerese para não oscilar perto da divisão.
export function snapOrigin(origin: Point, pointer: Point, puzzle: Puzzle, previous: Point | null): Point | null {
  const margin = 0;
  if (pointer.x < -margin || pointer.y < -margin || pointer.x > puzzle.board.width + margin || pointer.y > puzzle.board.height + margin) return null;
  const near = previous && Math.max(Math.abs(origin.x - previous.x), Math.abs(origin.y - previous.y)) <= 0.62;
  const target = near ? previous : { x: Math.round(origin.x), y: Math.round(origin.y) };
  return Math.max(Math.abs(origin.x - target.x), Math.abs(origin.y - target.y)) <= 0.62 ? target : null;
}

// Distância de atração em células; somente para a demonstração verificada.
export const LAST_PLACEMENT_RADIUS = 0.9;
export function lastPlacementAnchor(puzzle: Puzzle, snapshot: Snapshot, piece: PieceInstance, origin: Point, pointer: Point, enabled: boolean): Point | null {
  if (!enabled || puzzle.challenge.source !== 'demo' || puzzle.challenge.geometryStatus !== 'verified') return null;
  if (pointer.x < 0 || pointer.y < 0 || pointer.x > puzzle.board.width || pointer.y > puzzle.board.height) return null;
  const remaining = snapshot.pieces.filter(p => !p.position);
  if (remaining.length !== 1 || remaining[0].id !== piece.id) return null;
  const anchors = validAnchors(puzzle, snapshot, piece);
  if (anchors.length !== 1) return null;
  const anchor = anchors[0];
  return Math.max(Math.abs(origin.x - anchor.x), Math.abs(origin.y - anchor.y)) <= LAST_PLACEMENT_RADIUS ? anchor : null;
}
