import { useRef, useState, type Dispatch } from 'react';
import type { Action, GameState, Puzzle } from '@/game/engine/types';
import { localCells } from '@/game/engine/geometry';
import { GamePiece } from './GamePiece';
import type { DragInteraction } from '@/game/state/useDragInteraction';
import styles from './Game.module.css';

export function PieceTray({ puzzle, state, dispatch, drag }: { puzzle: Puzzle; state: GameState; dispatch: Dispatch<Action>; drag: DragInteraction }) {
  const [expanded, setExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const selected = state.present.pieces.find(p => p.id === state.selectedId);
  const dragging = Boolean(drag.view && !drag.view.returning);
  const available = state.present.pieces.filter(p => !p.position);
  function select(id: string) {
    dispatch({ type: 'SELECT_PIECE', id });
    if (expanded) {
      setExpanded(false);
      requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }));
    }
  }
  return <section className={`${styles.trayPanel} ${expanded ? styles.trayExpanded : ''}`} aria-labelledby="pieces-heading">
    <div className={styles.sectionTitle}>
      <h2 id="pieces-heading">Suas peças</h2><span>{available.length} disponíveis</span>
      <button ref={toggleRef} className={styles.trayToggle} aria-expanded={expanded} aria-controls="piece-grid" disabled={dragging} onClick={() => setExpanded(!expanded)}>{expanded ? 'Recolher peças' : 'Ver todas as peças'}</button>
    </div>
    <p>Selecione uma peça ou arraste pelo desenho na bandeja lateral.</p>
    <div id="piece-grid" className={styles.tray}>{state.present.pieces.map(piece => <button type="button" key={piece.id} className={`${styles.pieceCard} ${piece.position ? styles.inBoard : ''} ${drag.view?.piece.id === piece.id && !drag.view.returning ? styles.dragOrigin : ''}`} {...drag.pointerHandlers}
      onPointerDown={event => {
        // Na grade mobile, navegar tem prioridade; o arraste usa o controle explícito abaixo.
        if (window.matchMedia('(max-width: 800px)').matches) return;
        const svg = (event.target as Element).closest('svg');
        if (svg) drag.begin(event, piece.id, svg, false);
      }} aria-pressed={state.selectedId === piece.id} onClick={() => select(piece.id)} aria-label={`Selecionar ${piece.id}, ${piece.orientation * 90} graus, ${piece.position ? 'no tabuleiro' : 'disponível'}`}>
      <div className={styles.cardTitle}><strong>{piece.id}</strong><span>{piece.orientation * 90}°</span></div>
      <span className={piece.position ? undefined : styles.dragHandle}><GamePiece cells={localCells(puzzle, piece)} code={piece.code} /></span>
      <small>{drag.view?.piece.id === piece.id && !drag.view.returning ? '↗ Arrastando' : piece.position ? '✓ No tabuleiro' : 'Disponível'}</small>
    </button>)}</div>
    <div className={styles.compactTray}>
      <div className={styles.pieceChips} aria-label="Peças disponíveis">{available.map(piece => <button key={piece.id} disabled={dragging} aria-pressed={piece.id === state.selectedId} onClick={() => select(piece.id)} aria-label={`Selecionar ${piece.id}, ${piece.orientation * 90} graus, disponível`}>{piece.id}</button>)}</div>
      {selected ? <div className={styles.selectedDock}>
        {!selected.position && <button className={styles.explicitDrag} aria-label={`Arrastar ${selected.id}`} {...drag.pointerHandlers}
          onPointerDown={event => { const svg = event.currentTarget.querySelector('svg'); if (svg) drag.begin(event, selected.id, svg, false); }}>
          <GamePiece cells={localCells(puzzle, selected)} code={selected.code} />
        </button>}
        <span><strong>{selected.id} · {selected.orientation * 90}°</strong><br />{selected.position ? 'No tabuleiro' : 'Arraste aqui ou toque numa casa'}</span>
        <button disabled={dragging} onClick={() => dispatch({ type: 'ROTATE_PIECE' })}>Girar peça</button>
      </div> : <p>Escolha uma peça. Use “Ver todas” para abrir a grade.</p>}
    </div>
    <div className={styles.selection}><strong>{state.selectedId ? `Selecionada: ${state.selectedId}` : 'Nenhuma peça selecionada'}</strong><span>O contorno e o ponto verde indicam onde a peça pode começar.</span></div>
  </section>;
}
