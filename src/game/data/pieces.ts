import type { PieceType } from '../engine/types';
export const pieceTypes: readonly PieceType[] = [
  { code: 'A', cells: [{ x: 0, y: 0, socket: 'circle' }, { x: 1, y: 0, socket: 'circle' }] },
  { code: 'B', cells: [{ x: 1, y: 0, socket: 'square' }, { x: 0, y: 1, socket: 'square' }, { x: 1, y: 1, socket: 'square' }] },
  { code: 'C', cells: [{ x: 0, y: 0, socket: 'circle' }, { x: 1, y: 0, socket: 'circle' }, { x: 2, y: 0, socket: 'circle' }] },
  { code: 'D', cells: [{ x: 0, y: 0, socket: 'square' }, { x: 1, y: 0, socket: 'square' }] },
];
