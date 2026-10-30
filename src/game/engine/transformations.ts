import type { Cell, Orientation, Point } from './types';
export function normalize(cells: readonly Cell[]): Cell[] {
  if (!cells.length) return [];
  const minX = Math.min(...cells.map(c => c.x));
  const minY = Math.min(...cells.map(c => c.y));
  return cells.map(c => ({ ...c, x: c.x - minX, y: c.y - minY }));
}
export function translate(cells: readonly Cell[], position: Point): Cell[] {
  return cells.map(c => ({ ...c, x: c.x + position.x, y: c.y + position.y }));
}
export function rotate90(cells: readonly Cell[]): Cell[] {
  return normalize(cells.map(c => ({ ...c, x: -c.y, y: c.x })));
}
export function transform(cells: readonly Cell[], orientation: Orientation, mirrored = false): Cell[] {
  let result = normalize(cells.map(c => ({ ...c, x: mirrored ? -c.x : c.x })));
  for (let i = 0; i < orientation; i++) result = rotate90(result);
  return result;
}
