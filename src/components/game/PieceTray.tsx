import type { Dispatch } from 'react';
import type { Action, GameState, Puzzle } from '@/game/engine/types';
import { localCells } from '@/game/engine/geometry';
import { GamePiece } from './GamePiece';
import type { DragInteraction } from '@/game/state/useDragInteraction';
import styles from './Game.module.css';
export function PieceTray({ puzzle, state, dispatch, drag }: { puzzle: Puzzle; state: GameState; dispatch: Dispatch<Action>; drag: DragInteraction }) {
  return <section className={styles.trayPanel} aria-labelledby="pieces-heading">
    <div className={styles.sectionTitle}><h2 id="pieces-heading">Suas peças</h2><span>{state.present.pieces.length} instâncias</span></div>
    <p>Arraste pelo desenho. Toque no cartão para selecionar; deslize pelos rótulos para rolar a bandeja.</p>
    <div className={styles.tray}>{state.present.pieces.map(piece => <button type="button" key={piece.id} className={`${styles.pieceCard} ${piece.position ? styles.inBoard : ''} ${drag.view?.piece.id === piece.id && !drag.view.returning ? styles.dragOrigin : ''}`} {...drag.pointerHandlers}
      onPointerDown={event => { const svg = (event.target as Element).closest('svg'); if (svg) drag.begin(event, piece.id, svg, false); }} aria-pressed={state.selectedId === piece.id} onClick={() => dispatch({ type: 'SELECT_PIECE', id: piece.id })} aria-label={`Selecionar ${piece.id}, ${piece.orientation * 90} graus, ${piece.position ? 'no tabuleiro' : 'disponível'}`}>
      <div className={styles.cardTitle}><strong>{piece.id}</strong><span>{piece.orientation * 90}°</span></div>
      <span className={piece.position ? undefined : styles.dragHandle}><GamePiece cells={localCells(puzzle, piece)} code={piece.code} /></span>
      <small>{drag.view?.piece.id === piece.id && !drag.view.returning ? '↗ Arrastando' : piece.position ? '✓ No tabuleiro' : 'Disponível'}</small>
    </button>)}</div>
    <div className={styles.selection}><strong>{state.selectedId ? `Selecionada: ${state.selectedId}` : 'Nenhuma peça selecionada'}</strong><span>O contorno e o ponto verde indicam onde a peça pode começar.</span></div>
  </section>;
}
