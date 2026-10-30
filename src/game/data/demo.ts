import type { Puzzle } from '../engine/types';
import { pieceTypes } from './pieces';
export const demo: Puzzle = {
  challenge: { id: 'DEMO-01', category: 'Laboratório de encaixes', pieceCodes: ['A', 'A', 'B', 'C', 'D'], source: 'demo', geometryStatus: 'verified' },
  board: { width: 4, height: 3, cells: Array.from({ length: 12 }, (_, i) => ({ x: i % 4, y: Math.floor(i / 4), socket: i % 4 < (i >= 8 ? 3 : 2) ? 'circle' : 'square' })) },
  types: pieceTypes, allowMirroring: false,
};
