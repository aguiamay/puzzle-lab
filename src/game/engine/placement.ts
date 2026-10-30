import type { PieceInstance, Point, Puzzle, Snapshot, Validation } from './types';
import { key, localCells, occupancy } from './geometry';
import { translate } from './transformations';

// Um contexto efêmero por consulta em lote, sem cache global ou estado derivado.
function placementValidator(puzzle: Puzzle, snapshot: Snapshot, piece: PieceInstance) {
  const orientationValid = [0, 1, 2, 3].includes(piece.orientation);
  const cells = orientationValid ? localCells(puzzle, piece) : [];
  const occupied = occupancy(puzzle, snapshot);
  const sockets = new Map(puzzle.board.cells.map(cell => [key(cell), cell.socket]));
  const known = snapshot.pieces.some(p => p.id === piece.id && p.code === piece.code);
  const placed = snapshot.pieces.some(p => p.id === piece.id && p.position !== null);
  const geometryValid = cells.length > 0 && new Set(cells.map(key)).size === cells.length;

  return (position: Point): Validation => {
    const fail = (reason: string): Validation => ({ ok: false, reason });
    if (!known) return fail('Instância desconhecida.');
    if (placed) return fail('Essa peça já está no tabuleiro. Remova-a antes de reposicionar.');
    if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) return fail('Escolha uma casa inteira do tabuleiro.');
    if (piece.mirrored && !puzzle.allowMirroring) return fail('Espelhamento não permitido.');
    if (!orientationValid) return fail('Orientação inválida.');
    if (!geometryValid) return fail('Geometria inválida.');
    for (const cell of translate(cells, position)) {
      if (cell.x < 0 || cell.y < 0 || cell.x >= puzzle.board.width || cell.y >= puzzle.board.height) return fail('A peça ultrapassa os limites do tabuleiro.');
      const socket = sockets.get(key(cell));
      if (!socket) return fail('Essa posição não pertence à área válida.');
      if (occupied[key(cell)]) return fail('Há sobreposição com outra peça.');
      if (socket !== cell.socket) return fail('Encaixe incompatível: combine círculos com círculos e quadrados com quadrados.');
    }
    return { ok: true };
  };
}

export function validatePlacement(puzzle: Puzzle, snapshot: Snapshot, piece: PieceInstance, position: Point): Validation {
  return placementValidator(puzzle, snapshot, piece)(position);
}

export function validAnchors(puzzle: Puzzle, snapshot: Snapshot, piece: PieceInstance): Point[] {
  if (piece.position) return [];
  const validate = placementValidator(puzzle, snapshot, piece);
  return puzzle.board.cells.filter(cell => validate(cell).ok).map(({ x, y }) => ({ x, y }));
}
