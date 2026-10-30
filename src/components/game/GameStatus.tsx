import type { GameState, Puzzle } from '@/game/engine/types';
import { occupancy } from '@/game/engine/geometry';
import { isComplete } from '@/game/engine/validation';
import styles from './Game.module.css';
export function GameStatus({ puzzle, state }: { puzzle: Puzzle; state: GameState }) {
  const count = Object.keys(occupancy(puzzle, state.present)).length;
  const complete = isComplete(puzzle, state.present);
  return <div className={styles.status}>
    <div className={styles.progressLabel}><strong>{complete ? '✓ Demonstração concluída' : 'Cada encaixe conta'}</strong><span>{count} / {puzzle.board.cells.length} casas</span></div>
    <progress aria-label="Casas preenchidas" value={count} max={puzzle.board.cells.length} />
    <p role="status" aria-live="polite" aria-atomic="true" className={state.feedback.error ? styles.error : styles.feedback}>{state.feedback.error ? 'Jogada recusada: ' : ''}{state.feedback.text}</p>
  </div>;
}
