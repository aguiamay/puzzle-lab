import type { Action, Puzzle } from '../../engine/types';
import { researchBoard } from './board';
import { observedRegions, researchPieces } from './pieces';
export const researchPuzzle: Puzzle = {
  challenge: { id: 'PESQUISA-001', category: 'Reconstrução parcial · não validada', source: 'demo', geometryStatus: 'unverified', pieceCodes: observedRegions.map(r => r.code) },
  board: researchBoard, types: researchPieces, allowMirroring: false,
};
// Reprodução dos contornos observados, não solução certificada do desafio 001.
const counts: Record<string, number> = {};
export const observedLayout: readonly Action[] = observedRegions.map(region => ({
  type: 'DROP_PIECE', id: `${region.code}-${counts[region.code] = (counts[region.code] ?? 0) + 1}`,
  orientation: 0,
  position: { x: Math.min(...region.points.map(([x]) => x)), y: Math.min(...region.points.map(([, y]) => y)) },
}));
