import type { Cell, Socket } from '@/game/engine/types';
import { pieceColor } from './presentation';
export function SocketMark({ x, y, socket }: { x: number; y: number; socket: Socket }) {
  if (socket === 'cross') return <path transform={`translate(${x} ${y})`} d="M-.045 -.13 H.045 V-.045 H.13 V.045 H.045 V.13 H-.045 V.045 H-.13 V-.045 H-.045 Z" />;
  return socket === 'circle' ? <circle cx={x} cy={y} r={0.105} /> : <rect x={x - 0.105} y={y - 0.105} width={0.21} height={0.21} rx={0.02} />;
}
export function GamePiece({ cells, code }: { cells: readonly Cell[]; code: string }) {
  const width = Math.max(...cells.map(c => c.x)) + 1;
  const height = Math.max(...cells.map(c => c.y)) + 1;
  return <svg viewBox={`-0.08 -0.08 ${width + 0.16} ${height + 0.16}`} aria-hidden="true" width="100%" height="80">
    {cells.map(c => <g key={`${c.x},${c.y}`}><rect x={c.x + 0.025} y={c.y + 0.025} width={0.95} height={0.95} rx={0.14} fill={pieceColor(code)} /><g fill="white"><SocketMark x={c.x + 0.5} y={c.y + 0.5} socket={c.socket} /></g></g>)}
  </svg>;
}
