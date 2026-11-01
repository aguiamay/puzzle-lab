import type { Board, Socket } from '../../engine/types';

// Transcrição visual das imagens 001, 002 e 008. Não certifica o tabuleiro físico.
export const boardEvidence = {
  geometryConfidence: 'inferred',
  observationConfidence: 'verified',
  sourceReferences: ['https://www.dudz.com.br/Cilada/AABCDDEFGIKN.png', 'https://www.dudz.com.br/Cilada/ABCDDEFFGJKM.png', 'https://www.dudz.com.br/Cilada/ABBCCCDDHKLN.png'],
} as const;
const rows = ['OO+++OQ', 'OQQQ+Q+', 'QO+OOQO', 'QO+Q++O'];
const marks: Record<string, Socket> = { O: 'circle', Q: 'square', '+': 'cross' };
export const researchBoard: Board = {
  width: 7, height: 4,
  cells: rows.flatMap((row, y) => [...row].map((mark, x) => ({ x, y, socket: marks[mark] }))),
};
