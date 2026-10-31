import type { DragInteraction } from '@/game/state/useDragInteraction';
import { pieceColor } from './presentation';
import { SocketMark } from './GamePiece';
import styles from './Game.module.css';

export function DragPreview({ drag }: { drag: DragInteraction }) {
  const view = drag.view;
  if (!view) return null;
  const width = Math.max(...view.cells.map(c => c.x)) + 1;
  const height = Math.max(...view.cells.map(c => c.y)) + 1;
  const message = view.returning ? drag.notice : view.validation.ok ? '✓ Encaixe permitido. Solte para confirmar.' : `× ${view.validation.reason}`;
  return <>
    <svg aria-hidden="true" className={`${styles.floatingPiece} ${view.returning ? styles.returning : ''}`}
      viewBox={`0 0 ${width} ${height}`} width={width * view.scale} height={height * view.scale}
      style={{ left: view.screenOrigin.x, top: view.screenOrigin.y }}>
      {view.cells.map(c => <g key={`${c.x},${c.y}`}>
        <rect x={c.x + 0.025} y={c.y + 0.025} width={0.95} height={0.95} rx={0.14} fill={pieceColor(view.piece.code)} />
        <g fill="white"><SocketMark x={c.x + 0.5} y={c.y + 0.4} socket={c.socket} /></g>
        <text x={c.x + 0.5} y={c.y + 0.78} className={styles.pieceLabel}>{view.piece.id}</text>
      </g>)}
    </svg>
    {!view.returning && <div className={styles.dragControls} aria-label="Controles do arraste">
      <p role="status"><strong>{view.piece.id} · {view.piece.orientation * 90}°</strong> {message}</p>
      <button onPointerDown={event => { if (event.pointerType === 'touch') { event.preventDefault(); drag.rotate(); } }}
        onClick={event => { if (!(event.nativeEvent instanceof PointerEvent) || event.nativeEvent.pointerType !== 'touch') drag.rotate(); }}>↻ Girar arraste</button>
      <button onPointerDown={event => { if (event.pointerType === 'touch') { event.preventDefault(); drag.cancel(); } }}
        onClick={event => { if (!(event.nativeEvent instanceof PointerEvent) || event.nativeEvent.pointerType !== 'touch') drag.cancel(); }}>Cancelar arraste</button>
    </div>}
  </>;
}

export function GhostPiece({ drag }: { drag: DragInteraction }) {
  const view = drag.view;
  if (!view?.anchor || view.returning) return null;
  const color = view.validation.ok ? pieceColor(view.piece.code) : '#b1392f';
  return <g aria-hidden="true" className={styles.ghost} data-valid={view.validation.ok} transform={`translate(${view.anchor.x} ${view.anchor.y})`}>
    {view.cells.map(c => <g key={`${c.x},${c.y}`}>
      <rect x={c.x + 0.04} y={c.y + 0.04} width={0.92} height={0.92} rx={0.12} fill={color} fillOpacity={0.35} stroke={color} strokeWidth={0.045} strokeDasharray={view.validation.ok ? undefined : '0.1 0.06'} />
      <text x={c.x + 0.5} y={c.y + 0.65} textAnchor="middle" fill={color} fontSize={0.32}>{view.validation.ok ? '✓' : '×'}</text>
    </g>)}
  </g>;
}
