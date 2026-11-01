import { useMemo, type Dispatch, type Ref } from 'react';
import type { Action, GameState, Puzzle } from '@/game/engine/types';
import { key, occupancy } from '@/game/engine/geometry';
import { validAnchors } from '@/game/engine/placement';
import { SocketMark } from './GamePiece';
import type { DragInteraction } from '@/game/state/useDragInteraction';
import { GhostPiece } from './DragPreview';
import styles from './Game.module.css';
import { pieceColor } from './presentation';
export function GameBoard({ puzzle, state, dispatch, drag, boardRef }: { puzzle: Puzzle; state: GameState; dispatch: Dispatch<Action>; drag: DragInteraction; boardRef: Ref<SVGSVGElement> }) {
  const occupied = useMemo(() => occupancy(puzzle, state.present), [puzzle, state.present]);
  const selected = state.present.pieces.find(p => p.id === state.selectedId);
  const anchors = useMemo(
    () => new Set(selected ? validAnchors(puzzle, state.present, selected).map(key) : []),
    [puzzle, state.present, selected],
  );
  const piecesById = new Map(state.present.pieces.map(piece => [piece.id, piece]));
  return <svg ref={boardRef} className={styles.board} viewBox={`-0.38 -0.38 ${puzzle.board.width + 0.5} ${puzzle.board.height + 0.5}`} role="group" aria-label="Tabuleiro. Selecione uma peça e depois uma casa." aria-describedby="board-help">
    {Array.from({ length: puzzle.board.width }, (_, x) => <text key={`x${x}`} x={x + 0.5} y={-0.15} className={styles.axis}>{x + 1}</text>)}
    {Array.from({ length: puzzle.board.height }, (_, y) => <text key={`y${y}`} x={-0.2} y={y + 0.54} className={styles.axis}>{y + 1}</text>)}
    {puzzle.board.cells.map(cell => {
      const id = occupied[key(cell)];
      const canPlace = !drag.view && anchors.has(key(cell));
      const active = id && id === state.selectedId;
      const activate = () => {
        if (id) dispatch({ type: 'SELECT_PIECE', id });
        else dispatch({ type: 'PLACE_PIECE', position: { x: cell.x, y: cell.y } });
      };
      return <g key={key(cell)} role="button" tabIndex={0} className={`${styles.cell} ${id ? styles.draggableCell : ''} ${id && drag.view?.piece.id === id && !drag.view.returning ? styles.dragOrigin : ''}`} {...drag.pointerHandlers}
        onPointerDown={event => { const svg = event.currentTarget.ownerSVGElement; if (id && svg) drag.begin(event, id, svg, true); }} aria-label={`Linha ${cell.y + 1}, coluna ${cell.x + 1}, ${cell.socket === 'circle' ? 'círculo' : cell.socket === 'cross' ? 'cruz' : 'quadrado'}${id ? `, peça ${id}` : ', vazia'}${canPlace ? ', início válido para a peça selecionada' : ''}`} aria-pressed={Boolean(active)} onClick={activate} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } }}>
        <rect className={`${styles.cellSurface} ${id ? styles.placedCell : ''}`} x={cell.x + 0.035} y={cell.y + 0.035} width={0.93} height={0.93} rx={0.13} fill={id ? pieceColor(piecesById.get(id)?.code ?? '') : '#f5f3ed'} stroke={active ? '#122e2b' : canPlace ? '#1c756f' : '#d1d5ce'} strokeWidth={active ? 0.055 : 0.018} />
        <g fill={id ? '#fff' : '#72796f'}><SocketMark x={cell.x + 0.5} y={cell.y + 0.39} socket={cell.socket} /></g>
        {id && <text x={cell.x + 0.5} y={cell.y + 0.76} className={styles.pieceLabel}>{id}</text>}
        {canPlace && <circle cx={cell.x + 0.18} cy={cell.y + 0.8} r={0.055} fill="#1c756f" />}
      </g>;
    })}
    <GhostPiece drag={drag} />
  </svg>;
}
