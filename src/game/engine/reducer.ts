import type { Action, GameState, Orientation, Puzzle, Snapshot } from './types';
import { validatePlacement, validateMove } from './placement';
import { isComplete } from './validation';
export function initialState(puzzle: Puzzle): GameState {
  const counts: Record<string, number> = {};
  return {
    present: { pieces: puzzle.challenge.pieceCodes.map(code => ({ id: `${code}-${counts[code] = (counts[code] ?? 0) + 1}`, code, orientation: 0, mirrored: false, position: null })) },
    past: [], future: [], selectedId: null,
    feedback: { text: 'Selecione uma peça para começar.', error: false },
  };
}
export function reduceGame(puzzle: Puzzle, state: GameState, action: Action): GameState {
  const message = (text: string, error = false): GameState => ({ ...state, feedback: { text, error } });
  const commit = (present: Snapshot, text: string): GameState => ({ ...state, present, past: [...state.past, state.present], future: [], feedback: { text: isComplete(puzzle, present) ? 'Demonstração concluída! Todos os encaixes estão corretos.' : text, error: false } });
  if (action.type === 'SELECT_PIECE') return state.present.pieces.some(p => p.id === action.id) ? { ...state, selectedId: action.id, feedback: { text: `Peça ${action.id} selecionada.`, error: false } } : message('Peça desconhecida.', true);
  if (action.type === 'RESET') return initialState(puzzle);
  if (action.type === 'UNDO') {
    const previous = state.past.at(-1);
    return previous ? { ...state, present: previous, past: state.past.slice(0, -1), future: [state.present, ...state.future], feedback: { text: 'Ação desfeita.', error: false } } : message('Nada para desfazer.');
  }
  if (action.type === 'REDO') {
    const next = state.future[0];
    return next ? { ...state, present: next, past: [...state.past, state.present], future: state.future.slice(1), feedback: { text: isComplete(puzzle, next) ? 'Demonstração concluída!' : 'Ação refeita.', error: false } } : message('Nada para refazer.');
  }
  if (action.type === 'DROP_PIECE') {
    const original = state.present.pieces.find(p => p.id === action.id);
    if (!original) return message('Peça desconhecida.', true);
    const candidate = { ...original, orientation: action.orientation };
    const result = validateMove(puzzle, state.present, candidate, action.position);
    if (!result.ok) return message(result.reason, true);
    if (original.position?.x === action.position.x && original.position?.y === action.position.y && original.orientation === action.orientation) return message('A peça permaneceu na mesma posição.');
    return commit({ pieces: state.present.pieces.map(p => p.id === original.id ? { ...candidate, position: { ...action.position } } : p) }, `${original.id} encaixada a ${action.orientation * 90}°.`);
  }
  const piece = state.present.pieces.find(p => p.id === state.selectedId);
  if (!piece) return message('Selecione uma peça primeiro.', true);
  if (action.type === 'PLACE_PIECE') {
    const result = validatePlacement(puzzle, state.present, piece, action.position);
    if (!result.ok) return message(result.reason, true);
    return commit({ pieces: state.present.pieces.map(p => p.id === piece.id ? { ...p, position: { ...action.position } } : p) }, `${piece.id} posicionada.`);
  }
  if (action.type === 'REMOVE_PIECE') {
    if (!piece.position) return message('Essa peça já está na bandeja.', true);
    return commit({ pieces: state.present.pieces.map(p => p.id === piece.id ? { ...p, position: null } : p) }, `${piece.id} removida.`);
  }
  const rotated = { ...piece, orientation: ((piece.orientation + 1) % 4) as Orientation };
  if (piece.position) {
    const without = { pieces: state.present.pieces.map(p => p.id === piece.id ? { ...p, position: null } : p) };
    const result = validatePlacement(puzzle, without, rotated, piece.position);
    if (!result.ok) return message(`Rotação recusada. ${result.reason}`, true);
  }
  return commit({ pieces: state.present.pieces.map(p => p.id === piece.id ? rotated : p) }, `${piece.id} rotacionada para ${rotated.orientation * 90}°.`);
}
