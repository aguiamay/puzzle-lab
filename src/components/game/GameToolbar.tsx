import type { Dispatch } from 'react';
import type { Action, GameState } from '@/game/engine/types';
import styles from './Game.module.css';
export function GameToolbar({ state, dispatch }: { state: GameState; dispatch: Dispatch<Action> }) {
  const selected = state.present.pieces.find(p => p.id === state.selectedId);
  return <><p className={styles.currentPiece}>
    {selected ? <><strong>{selected.id} · {selected.orientation * 90}°</strong> — {selected.position ? 'No tabuleiro. Arraste para mover ou use Remover peça.' : 'Disponível. Escolha uma casa vazia para posicionar.'}</> : 'Selecione uma peça na bandeja ou no tabuleiro.'}
  </p><div className={styles.toolbar} role="group" aria-label="Ações do jogo">
    <button disabled={!selected} onClick={() => dispatch({ type: 'ROTATE_PIECE' })}>↻ Rotacionar 90°</button>
    <button disabled={!selected?.position} onClick={() => dispatch({ type: 'REMOVE_PIECE' })}>Remover peça</button>
    <button disabled={!state.past.length} onClick={() => dispatch({ type: 'UNDO' })}>↶ Desfazer</button>
    <button disabled={!state.future.length} onClick={() => dispatch({ type: 'REDO' })}>↷ Refazer</button>
    <button onClick={() => dispatch({ type: 'RESET' })}>Reiniciar</button>
  </div></>;
}
