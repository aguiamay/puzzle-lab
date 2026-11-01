import type { PieceType } from '../../engine/types';
import { researchBoard, boardEvidence } from './board';
export type GeometryConfidence = 'verified' | 'inferred' | 'unknown';
export interface ResearchPiece extends PieceType {
  readonly geometryConfidence: GeometryConfidence;
  readonly sourceReferences: readonly string[];
  readonly originalCode: null;
}
// Regiões conferidas visualmente na imagem 001. Rxx NÃO corresponde a A–N.
export const observedRegions = [
  { code: 'R01', points: [[0, 0], [0, 1], [1, 1]] },
  { code: 'R02', points: [[1, 0], [2, 0]] },
  { code: 'R03', points: [[3, 0], [4, 0]] },
  { code: 'R04', points: [[5, 0], [4, 1], [5, 1]] },
  { code: 'R05', points: [[6, 0], [6, 1]] },
  { code: 'R06', points: [[2, 1], [3, 1]] },
  { code: 'R07', points: [[0, 2], [1, 2], [0, 3]] },
  { code: 'R08', points: [[2, 2], [3, 2], [3, 3]] },
  { code: 'R09', points: [[4, 2], [5, 2]] },
  { code: 'R10', points: [[6, 2], [6, 3]] },
  { code: 'R02', points: [[1, 3], [2, 3]] },
  { code: 'R03', points: [[4, 3], [5, 3]] },
] as const;
export const researchPieces: readonly ResearchPiece[] = observedRegions
  .filter((region, i, all) => all.findIndex(r => r.code === region.code) === i)
  .map(region => {
    const minX = Math.min(...region.points.map(([x]) => x));
    const minY = Math.min(...region.points.map(([, y]) => y));
    return {
      code: region.code, originalCode: null, geometryConfidence: 'inferred',
      sourceReferences: [boardEvidence.sourceReferences[0]],
      cells: region.points.map(([x, y]) => {
        const cell = researchBoard.cells.find(c => c.x === x && c.y === y);
        if (!cell) throw new Error('Região fora do tabuleiro pesquisado.');
        return { x: x - minX, y: y - minY, socket: cell.socket };
      }),
    };
  });
