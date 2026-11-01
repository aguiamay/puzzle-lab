import type { Cell, Puzzle, Snapshot } from './types';
import { key } from './geometry';
import { geometrySignature, rotate90, uniqueOrientations } from './transformations';
import { isComplete } from './validation';

export function auditGeometry(puzzle: Puzzle, snapshot?: Snapshot, requireConnected = false) {
  const errors: string[] = [];
  function checkCells(label: string, cells: readonly Cell[]) {
    if (!cells.length) errors.push(`${label}: geometria vazia.`);
    if (new Set(cells.map(key)).size !== cells.length) errors.push(`${label}: coordenadas duplicadas.`);
    if (cells.some(c => !Number.isInteger(c.x) || !Number.isInteger(c.y) || c.x < 0 || c.y < 0 || !['circle', 'square', 'cross'].includes(c.socket))) errors.push(`${label}: coordenada ou marca inválida.`);
  }
  checkCells('Tabuleiro', puzzle.board.cells);
  if (![puzzle.board.width, puzzle.board.height].every(n => Number.isInteger(n) && n > 0)) errors.push('Dimensões inválidas.');
  if (puzzle.board.cells.some(c => c.x >= puzzle.board.width || c.y >= puzzle.board.height)) errors.push('Célula fora dos limites.');
  if (new Set(puzzle.types.map(t => t.code)).size !== puzzle.types.length) errors.push('Tipos duplicados.');
  const types = puzzle.types.map(type => {
    checkCells(type.code, type.cells);
    let rotated = [...type.cells];
    for (let i = 0; i < 4; i++) rotated = rotate90(rotated);
    if (geometrySignature(rotated) !== geometrySignature(type.cells)) errors.push(`${type.code}: rotação completa não preserva geometria/marcas.`);
    const reached = new Set<string>();
    const stack = type.cells.length ? [type.cells[0]] : [];
    while (stack.length) {
      const cell = stack.pop()!;
      if (reached.has(key(cell))) continue;
      reached.add(key(cell));
      stack.push(...type.cells.filter(c => !reached.has(key(c)) && Math.abs(c.x - cell.x) + Math.abs(c.y - cell.y) === 1));
    }
    const connected = reached.size === type.cells.length && type.cells.length > 0;
    if (requireConnected && !connected) errors.push(`${type.code}: peça desconectada.`);
    return { code: type.code, cells: type.cells.length, connected, orientations: uniqueOrientations(type.cells), multiplicity: puzzle.challenge.pieceCodes.filter(code => code === type.code).length };
  });
  for (const code of puzzle.challenge.pieceCodes) if (!puzzle.types.some(t => t.code === code)) errors.push(`Tipo ausente: ${code}.`);
  const requiredArea = types.reduce((total, type) => total + type.cells * type.multiplicity, 0);
  if (requiredArea !== puzzle.board.cells.length) errors.push('Área das instâncias difere da área do tabuleiro.');
  if (snapshot) {
    if (new Set(snapshot.pieces.map(p => p.id)).size !== snapshot.pieces.length) errors.push('IDs de instância duplicados.');
    if (JSON.stringify(snapshot.pieces.map(p => p.code).sort()) !== JSON.stringify([...puzzle.challenge.pieceCodes].sort())) errors.push('Multiplicidade de instâncias incorreta.');
    if (snapshot.pieces.some(p => ![0, 1, 2, 3].includes(p.orientation) || (p.mirrored && !puzzle.allowMirroring))) errors.push('Transformação de instância inválida.');
  }
  // Área igual é uma condição necessária, nunca uma prova de solução.
  const layoutComplete = snapshot && errors.length === 0 ? isComplete(puzzle, snapshot) : false;
  if (snapshot && !layoutComplete) errors.push('Disposição incompleta ou incompatível com o modelo.');
  return { errors, types, requiredArea, boardArea: puzzle.board.cells.length, layoutComplete, provesOriginalRules: false as const };
}
