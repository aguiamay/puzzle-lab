import type { Dispatch } from 'react';
import type { Action, GameState, Puzzle } from '@/game/engine/types';
import { localCells } from '@/game/engine/geometry';
import { GamePiece } from './GamePiece';
import styles from './Game.module.css';
export function PieceTray({ puzzle, state, dispatch }: { puzzle: Puzzle; state: GameState; dispatch: Dispatch<Action> }) {
  return <section className={styles.trayPanel} aria-labelledby="pieces-heading">
    <div className={styles.sectionTitle}><h2 id="pieces-heading">Suas peças</h2><span>{state.present.pieces.length} instâncias</span></div>
    <p>Escolha uma peça. Cada letra com número é uma peça independente.</p>
    <div className={styles.tray}>{state.present.pieces.map(piece => <button type="button" key={piece.id} className={styles.pieceCard} aria-pressed={state.selectedId === piece.id} onClick={() => dispatch({ type: 'SELECT_PIECE', id: piece.id })} aria-label={`Selecionar ${piece.id}, ${piece.orientation * 90} graus, ${piece.position ? 'no tabuleiro' : 'disponível'}`}>
      <div className={styles.cardTitle}><strong>{piece.id}</strong><span>{piece.orientation * 90}°</span></div>
      <GamePiece cells={localCells(puzzle, piece)} code={piece.code} />
      <small>{piece.position ? '✓ No tabuleiro' : 'Disponível'}</small>
    </button>)}</div>
    <div className={styles.selection}><strong>{state.selectedId ? `Selecionada: ${state.selectedId}` : 'Nenhuma peça selecionada'}</strong><span>O contorno e o ponto verde indicam onde a peça pode começar.</span></div>
  </section>;
}
