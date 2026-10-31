import type { Point, Puzzle } from '../engine/types';

// Raio em unidades de célula, com histerese para não oscilar perto da divisão.
export function snapOrigin(origin: Point, pointer: Point, puzzle: Puzzle, previous: Point | null): Point | null {
  const margin = 0;
  if (pointer.x < -margin || pointer.y < -margin || pointer.x > puzzle.board.width + margin || pointer.y > puzzle.board.height + margin) return null;
  const near = previous && Math.max(Math.abs(origin.x - previous.x), Math.abs(origin.y - previous.y)) <= 0.62;
  const target = near ? previous : { x: Math.round(origin.x), y: Math.round(origin.y) };
  return Math.max(Math.abs(origin.x - target.x), Math.abs(origin.y - target.y)) <= 0.62 ? target : null;
}
